import {
  entryDataKey,
  userEntriesKey,
  userHeartsKey,
  redis,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Array.isArray(req.query.userId)
    ? req.query.userId[0]
    : req.query.userId;
  const pageUserId = Array.isArray(req.query.pageUserId)
    ? req.query.pageUserId[0]
    : req.query.pageUserId;

  const page = Number(req.query.page) || 1;
  const limit = 8;
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  if (!userId || !pageUserId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Fetch entry IDs from cache
    let entryIds = await redis.zrange(userEntriesKey(userId), start, end, {
      rev: true,
    });

    // Fetch entries from database if not cached
    if (!entryIds.length) {
      const entries = await prisma.entry.findMany({
        where: { author_id: userId },
        orderBy: { created_at: "desc" },
        select: { id: true, author_id: true, created_at: true },
      });

      // Exit early if no entries are found
      if (!entries.length) {
        return res.status(200).json({
          entries: [],
          pagination: { nextPage: null },
        });
      }

      // Cache the entries in Redis
      const pipeline = redis.pipeline();
      entries.forEach((entry) => {
        pipeline.zadd(userEntriesKey(userId), {
          score: new Date(entry.created_at).getTime(),
          member: entry.id,
        });
      });
      await pipeline.exec();

      entryIds = await redis.zrange(userEntriesKey(userId), start, end, {
        rev: true,
      });
    }

    // Pagination
    const totalEntries = await redis.zcard(userEntriesKey(userId));
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    // User has entries, fetch entry data from the cache
    const pipeline = redis.pipeline();
    entryIds.forEach((entryId: any) => pipeline.hgetall(entryDataKey(entryId)));
    const results = await pipeline.exec();

    let entries = results.map((result: any) => result[1]);

    // Fetch from DB if any Redis entries are missing
    const missingEntryIds: string[] = entries
      // Map missing entries to their IDs, others to null
      .map((entry: any, index: number) => (entry ? null : entryIds[index]))
      // Keep only string IDs, removing nulls
      .filter((id): id is string => id !== null);

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
          // Extra fields for artifacts
          rating: entry.rating,
          loved: entry.loved,
          replay: entry.replay,
          created_at: entry.created_at.toISOString(),
        });
      });
      await pipeline.exec();

      // Merge the cached entries with the DB entries
      entries = entries.map(
        (entry, index) =>
          entry || dbEntries.find((dbEntry) => dbEntry.id === entryIds[index]),
      );
    }

    if (pageUserId !== userId) {
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

      hearts.length &&
        entries.forEach((entry) => {
          entry.heartedByUser = hearts.includes(entry.id);
        });
    }

    return res.status(200).json({
      entries: entries,
      pagination: { nextPage: hasMorePages ? page + 1 : null },
    });
  } catch (error) {
    console.error("Error fetching user entries:", error);
    return res.status(500).json({ error: "Error fetching user entries." });
  }
}
