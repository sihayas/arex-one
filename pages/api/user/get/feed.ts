import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import {
  entryDataKey,
  userEntriesKey,
  userFeedKey,
  userHeartsKey,
  redis,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";

export default async function onRequestGet(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  if (!userId) {
    return createResponse({ error: "Missing parameters" }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    let entryIds = await redis.zrange(userFeedKey(userId), start, end, {
      rev: true,
    });

    // User has no entry ids in their feed cache, attempt to populate it
    if (!entryIds.length) {
      const following = await prisma.user.findUnique({
        where: { id: userId },
        select: { following: { select: { id: true } } },
      });

      // If the user is not following anyone, return an empty feed
      if (!following || following.following.length === 0) {
        return createResponse(
          { data: { activities: [], pagination: null } },
          200,
        );
      }

      const followingIds = following.following.map((user) => user.id);

      // Get the entry id's from the cache for each user
      const pipeline = redis.pipeline();
      followingIds.forEach((id) => pipeline.smembers(userEntriesKey(id)));
      const results: [Error | null, string[]][] = await pipeline.exec();

      // Cross-reference the following ids with the cache results. If for a
      // certain index/user the ids returned are empty, check DB
      const missingEntriesIds = followingIds.filter(
        (id, index) => results[index][1].length === 0,
      );

      // All entries were found in cache, aggregate them
      if (!missingEntriesIds.length) {
        entryIds = await redis.zrange(userFeedKey(userId), start, end, {
          rev: true,
        });
      }

      // Some following users have no entries in cache, fetch them from DB
      if (missingEntriesIds.length > 0) {
        const dbEntries = await prisma.entry.findMany({
          where: { author_id: { in: missingEntriesIds } },
          orderBy: { created_at: "desc" },
          select: { id: true, author_id: true, created_at: true },
        });

        const pipeline = redis.pipeline();
        dbEntries.forEach((entry) => {
          const unixTimestamp = new Date(entry.created_at).getTime();
          pipeline.zadd(userEntriesKey(entry.author_id), {
            score: unixTimestamp,
            member: entry.id,
          });
          pipeline.zadd(userFeedKey(userId), {
            score: unixTimestamp,
            member: entry.id,
          });
        });
        await pipeline.exec();

        // Refresh the entryIds from the updated cache
        entryIds = await redis.zrange(userFeedKey(userId), start, end, {
          rev: true,
        });
      }
    }

    // Pagination
    const totalEntries = await redis.zcard(userFeedKey(userId));
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    // User has a feed, fetch the entries from the cache
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
          rating: entry.rating,
          loved: entry.loved,
          replay: entry.replay,
          created_at: entry.created_at.toISOString(),
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
            select: { reference_id: true },
          },
        },
      });
      if (user && user.actions.length) {
        const entryIds = user.actions.map((action) => action.reference_id);
        await redis.sadd(userHeartsKey(userId), ...entryIds);
      }
    }

    hearts.length &&
      entries.forEach((entry) => {
        entry.heartedByUser = hearts.includes(entry.id);
      });

    return createResponse(
      {
        data: {
          activities: entries,
          pagination: { nextPage: hasMorePages ? page + 1 : null },
        },
      },
      200,
    );
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return createResponse({ error: "Failed to fetch feed." }, 500);
  }
}

export const runtime = "edge";
