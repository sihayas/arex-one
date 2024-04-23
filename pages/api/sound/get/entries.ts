import {
  entryDataKey,
  userHeartsKey,
  redis,
  userProfileKey,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { formatEntry, formatProfile } from "@/lib/helper/cache";
import { EntryExtended } from "@/types/global";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Array.isArray(req.query.userId)
    ? req.query.userId[0]
    : req.query.userId;
  const soundId = Array.isArray(req.query.soundId)
    ? req.query.soundId[0]
    : req.query.soundId;

  const sort = req.query.sort || "newest";
  const range = req.query.range; // low 0-2, mid 2.5-3.5, high (4-5)
  const rangeRating =
    range === "low"
      ? { lte: 2 }
      : range === "mid"
      ? { gte: 2.5, lte: 3.5 }
      : { gte: 4 };

  const page = Number(req.query.page) || 1;
  const limit = 8;
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  if (!userId || !soundId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // (currently only supports sorting by newest)
    const cacheKey = `sound:${soundId}:entry_ids:${sort}:${range}`;

    // check if the cache exists
    let entryIds: any = await redis.zrange(cacheKey, start, end, {
      rev: true,
    });

    // (1) sound has no entry ids, fetch from the database
    if (!entryIds.length) {
      const entries = await prisma.entry.findMany({
        where: { sound_id: soundId, type: "artifact", rating: rangeRating },
        orderBy: { created_at: "desc" },
        select: { id: true, created_at: true },
      });

      // exit early if no entries are found
      if (!entries) {
        return res.status(200).json({
          entries: [],
          pagination: { nextPage: null },
        });
      }

      // Cache the entry IDs to their respective sorted set.
      const pipeline = redis.pipeline();
      entries.forEach((entry) => {
        pipeline.zadd(cacheKey, {
          score: new Date(entry.created_at).getTime(),
          member: entry.id,
        });
      });
      await pipeline.exec();

      // Fetch the entry IDs based on the range
      entryIds = await redis.zrange(cacheKey, start, end, {
        rev: true,
      });
    }

    // (2) Sound has entry ids, fetch the entries
    const entryPipeline = redis.pipeline();
    entryIds.forEach((entryId: any) =>
      entryPipeline.hgetall(entryDataKey(entryId)),
    );
    const entryResults: [Error | null, string[]][] = await entryPipeline.exec();

    let entries = entryResults.map((result: any) =>
      result ? result[1] : null,
    );

    // Map missing entries to their IDs, others to null
    const missingEntryIds: string[] = entries
      .map((entry: any, index: number) => (entry ? null : entryIds[index]))
      .filter((id): id is string => id !== null);

    if (missingEntryIds.length > 0) {
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
            select: { actions: { where: { type: "heart" } }, chains: true },
          },
        },
      });

      // Cache the missing entries in Redis
      const pipeline = redis.pipeline();
      dbEntries.forEach((entry) => {
        const formattedEntry = formatEntry(entry);
        pipeline.hset(entryDataKey(entry.id), formattedEntry);
      });
      await pipeline.exec();

      // Merge the cached entries with the DB entries
      entries = entries.map(
        (entry, index) =>
          entry ||
          formatEntry(
            dbEntries.find((dbEntry) => dbEntry.id === entryIds[index])!,
          ),
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
              sound: { select: { apple_id: true, id: true } },
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
        pipeline.hset(userProfileKey(author.id), formatProfile(author));
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
    entries.forEach((entry) => {
      entry.heartedByUser = hearts.includes(entry.id);
    });

    // Pagination
    const totalEntries = await redis.zcard(cacheKey);
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    return res.status(200).json({
      entries: entries,
      pagination: { nextPage: hasMorePages ? page + 1 : null },
    });
  } catch (error) {
    console.error("Error fetching user entries:", error);
    return res.status(500).json({ error: "Error fetching user entries." });
  }
}
