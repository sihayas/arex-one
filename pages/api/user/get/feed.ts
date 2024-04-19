import { prisma } from "@/lib/global/prisma";
import {
  entryDataKey,
  userEntriesKey,
  userFeedKey,
  userHeartsKey,
  redis,
} from "@/lib/global/redis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Array.isArray(req.query.userId)
    ? req.query.userId[0]
    : req.query.userId;

  const page = Number(req.query.page) || 1;
  const limit = 8;
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  if (!userId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    let entryIds = await redis.zrange(userFeedKey(userId), start, end, {
      rev: true,
    });

    // User has no entry ids in their feed cache, attempt to populate it
    if (!entryIds.length) {
      let followingIds = [];
      // Get the following ids
      const user = await prisma.user.findUnique({
        where: { id: userId, status: "active" },
        select: {
          following: {
            where: { is_deleted: false },
            select: { following_id: true },
          },
        },
      });

      // Push the user's following ids to the array
      user && followingIds.push(...user.following.map((f) => f.following_id));
      followingIds.push(userId);

      // Get the entries set with scores from the cache for each following
      const pipeline = redis.pipeline();
      followingIds.forEach((id) =>
        pipeline.zrange(userEntriesKey(id), 0, -1, { withScores: true }),
      );
      const results: [Error | null, string[]][] = await pipeline.exec();

      // The filter function returns an array of the IDs of the users for whom no entries were found in the cache (missingEntriesIds).
      const missingEntriesIds = followingIds.filter(
        (id, index) => results[index][1].length === 0,
      );

      let allEntries: { id: string; timestamp: number }[] = [];
      const entryPipeline = redis.pipeline();

      // Some following users have no entries in cache, fetch from DB & cache
      if (missingEntriesIds.length) {
        const dbEntries = await prisma.entry.findMany({
          where: { author_id: { in: missingEntriesIds } },
          orderBy: { created_at: "desc" },
          select: { id: true, author_id: true, created_at: true },
        });

        dbEntries.forEach((entry) => {
          // Add the entry to the allEntries array
          allEntries.push({
            id: entry.id,
            timestamp: new Date(entry.created_at).getTime(),
          });
          // Cache the entry in the user's entries set
          entryPipeline.zadd(userEntriesKey(entry.author_id), {
            score: new Date(entry.created_at).getTime(),
            member: entry.id,
          });
        });
      }

      // Entries found in cache, aggregate and add to allEntries array
      results.forEach((result, index) => {
        if (result[1].length > 0) {
          for (let i = 0; i < result[1].length; i += 2) {
            allEntries.push({
              id: result[1][i],
              timestamp: Number(result[1][i + 1]),
            });
          }
        }
      });

      // Update the user's feed in Redis with the aggregated entries
      allEntries.forEach((entry) => {
        entryPipeline.zadd(userFeedKey(userId), {
          score: entry.timestamp,
          member: entry.id,
        });
      });

      await pipeline.exec();

      // Refresh the entryIds from the updated cache
      entryIds = await redis.zrange(userFeedKey(userId), start, end, {
        rev: true,
      });
    }

    // User has a feed, fetch the entry data from the cache
    const pipeline = redis.pipeline();
    entryIds.forEach((entryId: any) => pipeline.hgetall(entryDataKey(entryId)));
    const results = await pipeline.exec();

    let entries = results.map((result: any) => result[1]);

    // Map missing entries to their IDs, others to null
    const missingEntryIds: string[] = entries
      .map((entry: any, index: number) => (entry ? null : entryIds[index]))
      // Keep only string IDs, removing nulls
      .filter((id): id is string => id !== null);

    // Fetch from DB if any entries data are missing
    if (missingEntryIds.length > 0) {
      const dbEntries = await prisma.entry.findMany({
        where: { id: { in: missingEntryIds } },
        select: {
          id: true,
          sound_id: true,
          type: true,
          author_id: true,
          text: true,
          rating: true,
          loved: true,
          replay: true,
          created_at: true,
          _count: {
            select: {
              actions: {
                where: { type: "heart" },
              },
              replies: true,
            },
          },
        },
      });

      // Cache the missing entries in Redis
      const pipeline = redis.pipeline();
      dbEntries.forEach((entry) => {
        pipeline.hset(entryDataKey(entry.id), {
          id: entry.id,
          sound_id: entry.sound_id,
          type: entry.type,
          author_id: entry.author_id,
          text: entry.text,
          rating: entry.rating,
          loved: entry.loved,
          replay: entry.replay,
          created_at: entry.created_at.toISOString(),
          likes_count: entry._count.actions,
          chains_count: entry._count.replies,
        });
      });
      await pipeline.exec();

      entries = entries.map(
        (entry, index) =>
          entry || dbEntries.find((dbEntry) => dbEntry.id === entryIds[index]),
      );
    }

    // Check if the user has liked any of the entries
    let hearts = await redis.smembers(userHeartsKey(userId));
    // If the user has no hearts cached, attempt to populate it
    if (!hearts.length) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          actions: {
            where: { type: "heart" },
            select: { entry_id: true, reply_id: true },
          },
        },
      });
      if (user && user.actions.length) {
        const entryIds = user.actions.map(
          (action) => action.reply_id || action.entry_id,
        );
        await redis.sadd(userHeartsKey(userId), ...entryIds);
      }
    }

    // Add the heartedByUser property to each entry
    hearts.length &&
      entries.forEach((entry) => {
        entry.heartedByUser = hearts.includes(entry.id);
      });

    // Pagination
    const totalEntries = await redis.zcard(userFeedKey(userId));
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    return res.status(200).json({
      entries: entries,
      pagination: { nextPage: hasMorePages ? page + 1 : null },
    });
  } catch (error) {
    console.error("Error fetching feed", error);
    return res.status(500).json({ error: "Error fetching feed." });
  }
}
