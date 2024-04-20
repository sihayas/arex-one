import { prisma } from "@/lib/global/prisma";
import {
  entryDataKey,
  userEntriesKey,
  userFeedKey,
  userHeartsKey,
  redis,
  userProfileKey,
} from "@/lib/global/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { Entry, Sound } from "@prisma/client";
import { AlbumData, SongData } from "@/types/appleTypes";

type SoundExtended = Sound & { appleData: AlbumData | SongData };
type EntryExtended = Entry & { sound: SoundExtended };

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

    // (1) User has no entry ids in their feed cache, attempt to populate it
    if (!entryIds.length) {
      let followingIds = [userId];
      let allEntries: { id: string; timestamp: number }[] = [];

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

      // Get each users entries set with scores
      const entriesPipeline = redis.pipeline();
      followingIds.forEach((id) =>
        entriesPipeline.zrange(userEntriesKey(id), 0, -1, { withScores: true }),
      );
      const entries: [Error | null, string[]][] = await entriesPipeline.exec();

      // Aggregate entries found in cache into allEntries array
      entries.forEach((response, index) => {
        const set = response[1];
        if (set && set.length > 0) {
          for (let i = 0; i < set.length; i += 2) {
            allEntries.push({
              id: set[i],
              timestamp: Number(set[i + 1]),
            });
          }
        }
      });

      // Filter out the following ids with no entries set in cache
      const idsWithMissingEntries = followingIds.filter((id, index) => {
        const set = entries[index];
        if (set && set[1]) {
          return set[1].length === 0;
        }
      });

      // Some following users have no entries in cache, check from DB & cache
      if (idsWithMissingEntries.length) {
        const dbEntries = await prisma.entry.findMany({
          where: { author_id: { in: idsWithMissingEntries } },
          orderBy: { created_at: "desc" },
          select: { id: true, author_id: true, created_at: true },
        });

        if (dbEntries.length) {
          const userEntriesPipeline = redis.pipeline();
          dbEntries.forEach((entry) => {
            // Add the entry to the allEntries array
            allEntries.push({
              id: entry.id,
              timestamp: new Date(entry.created_at).getTime(),
            });
            // Cache the entry in the user's entries set
            userEntriesPipeline.zadd(userEntriesKey(entry.author_id), {
              score: new Date(entry.created_at).getTime(),
              member: entry.id,
            });
          });
          await userEntriesPipeline.exec();
        }
      }

      // XXX Exit early if no entries were found across cache and DB
      if (!allEntries.length)
        return res
          .status(200)
          .json({ entries: [], pagination: { nextPage: null } });

      // Update the user's feed in Redis with all entries
      const userFeedPipeline = redis.pipeline();
      allEntries.forEach((entry) => {
        userFeedPipeline.zadd(userFeedKey(userId), {
          score: entry.timestamp,
          member: entry.id,
        });
      });
      await userFeedPipeline.exec();

      // Refresh the entryIds from the updated cache
      entryIds = await redis.zrange(userFeedKey(userId), start, end, {
        rev: true,
      });
    }

    // (2) User has entry ids in their feed, fetch entry data from the cache
    const entryPipeline = redis.pipeline();
    entryIds.forEach((entryId: any) =>
      entryPipeline.hgetall(entryDataKey(entryId)),
    );
    const entryResults = await entryPipeline.exec();

    let entries = entryResults.map((result: any) => result[1]);

    // Map missing entries to their IDs, others to null
    const missingEntryIds: string[] = entries
      .map((entry: any, index: number) => (entry ? null : entryIds[index]))
      .filter((id): id is string => id !== null);

    // Fetch from DB if any entry data is missing
    if (missingEntryIds.length) {
      const dbEntries = await prisma.entry.findMany({
        where: { id: { in: missingEntryIds } },
        select: {
          id: true,
          sound: { select: { id: true, apple_id: true, type: true } },
          type: true,
          author_id: true,
          text: true,
          rating: true,
          loved: true,
          replay: true,
          created_at: true,
          _count: {
            select: { actions: { where: { type: "heart" } }, replies: true },
          },
        },
      });

      // Cache the missing entries in Redis
      const pipeline = redis.pipeline();
      dbEntries.forEach((entry) => {
        pipeline.hset(entryDataKey(entry.id), {
          id: entry.id,
          sound: {
            id: entry.sound.id,
            apple_id: entry.sound.apple_id,
            type: entry.sound.type,
          },
          type: entry.type,
          author_id: userId,
          text: entry.text,
          // Extra fields for artifacts
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

    // (3) Attach author data to each entry
    const authorIds = entries.map((entry: EntryExtended) => entry.author_id);

    // Check if the author data is already cached
    const pipeline = redis.pipeline();
    authorIds.forEach((id) => pipeline.hgetall(userProfileKey(id)));
    const authorResults = await pipeline.exec();

    let authors = authorResults.map((result: any) => result[1]);

    // Map missing authors to their IDs, others to null
    const missingAuthorIds: string[] = authors
      .map((author: any, index: number) => (author ? null : authorIds[index]))
      .filter((id): id is string => id !== null);

    if (missingAuthorIds.length) {
      const dbAuthors = await prisma.user.findMany({
        where: { id: { in: missingAuthorIds } },
        select: {
          id: true,
          image: true,
          username: true,
          bio: true,
          essentials: {
            select: {
              id: true,
              rank: true,
              sound: { select: { apple_id: true } },
            },
            orderBy: { rank: "desc" },
          },
          _count: {
            select: {
              followers: true,
              entries: { where: { type: "artifact" } },
            },
          },
        },
      });

      // Cache the missing author data in Redis
      const pipeline = redis.pipeline();
      dbAuthors.forEach((author) => {
        pipeline.hset(userProfileKey(author.id), {
          id: author.id,
          image: author.image,
          username: author.username,
          bio: author.bio,
          essentials: JSON.stringify(author.essentials),
          _count: JSON.stringify(author._count),
        });
      });
      await pipeline.exec();

      // Update the authors array with the fetched missing data
      authors = authors.map(
        (author, index) =>
          author ||
          dbAuthors.find((dbAuthor) => dbAuthor.id === authorIds[index]),
      );
    }

    // Attach author data to each entry
    entries.forEach((entry, index) => {
      entry.author = authors[index];
    });

    // (5) Check if the user has liked any of the entries
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
