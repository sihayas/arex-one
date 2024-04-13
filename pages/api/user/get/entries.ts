import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import {
  entryDataKey,
  userEntriesKey,
  userHeartsKey,
  redis,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";

export default async function onRequestGet(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const pageUserId = searchParams.get("pageUserId");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  if (!userId || !pageUserId) {
    return createResponse({ error: "Missing parameters" }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

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
        return createResponse(
          { data: { activities: [], pagination: { nextPage: null } } },
          200,
        );
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

      // If the user has no hearts cached, check the database
      if (!hearts.length) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            actions: {
              where: { type: "heart" },
              select: { reference_id: true },
            },
          },
        });

        if (user && user.actions.length) {
          const entryIds = user.actions.map((action) => action.reference_id);
          await redis.sadd(userHeartsKey(userId), ...entryIds);
        }
      }

      // Attach heartedByUser property to each entry
      hearts.length &&
        entries.forEach((entry) => {
          entry.heartedByUser = hearts.includes(entry.id);
        });
    }

    return createResponse(
      {
        data: {
          entries: entries,
          pagination: { nextPage: hasMorePages ? page + 1 : null },
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching user entries:", error);
    return createResponse({ error: "Error fetching user entries." }, 500);
  }
}

export const runtime = "edge";
