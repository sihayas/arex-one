import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/global/redis";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 6;

  if (
    !userId ||
    isNaN(page) ||
    page < 1 ||
    isNaN(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid user ID, page number or limit." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const feedKey = `user:${userId}:feed`;

    const start = (page - 1) * limit;
    const end = page * limit - 1;

    let entryIds = await redis.zrange(feedKey, start, end, {
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
        return new Response(
          JSON.stringify({ data: { activities: [], pagination: null } }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const followingIds = following.following.map((user) => user.id);

      // Get the entry id's from the cache for each user
      const pipeline = redis.pipeline();
      followingIds.forEach((id) => pipeline.smembers(`user:${id}:entries`));
      const results: [Error | null, string[]][] = await pipeline.exec();

      // Cross-reference the following ids with the cache results. If for a
      // certain index/user the ids returned are empty, check DB
      const missingEntriesIds = followingIds.filter(
        (id, index) => results[index][1].length === 0,
      );

      // All entries were found in cache, aggregate them
      if (!missingEntriesIds.length) {
        entryIds = await redis.zrange(feedKey, start, end, {
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
          pipeline.zadd(`user:${entry.author_id}:entries`, {
            score: unixTimestamp,
            member: entry.id,
          });
          pipeline.zadd(`user:${userId}:feed`, {
            score: unixTimestamp,
            member: entry.id,
          });
        });
        await pipeline.exec();

        // Refresh the entryIds from the updated cache
        entryIds = await redis.zrange(feedKey, start, end, {
          rev: true,
        });
      }
    }

    // Pagination
    const totalEntries = await redis.zcard(feedKey);
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    // User has a feed, fetch the entries from the cache
    const pipeline = redis.pipeline();
    entryIds.forEach((entryId) => pipeline.hgetall(`entry:${entryId}:data`));
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
        pipeline.hset(`entry:${entry.id}:data`, {
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
    const heartsKey = `user:${userId}:hearts`;
    let hearts = await redis.smembers(heartsKey);

    // If the user has no hearts cached, attempt to populate it
    if (!hearts.length) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { hearts: { select: { entry_id: true, reply_id: true } } },
      });
      if (user && user.hearts.length) {
        const heartIds = user.hearts.map(
          (heart) => heart.entry_id || heart.reply_id,
        );
        await redis.sadd(heartsKey, ...heartIds);
      }
    }

    hearts.length &&
      entries.forEach((entry) => {
        entry.heartedByUser = hearts.includes(entry.id);
      });

    return new Response(
      JSON.stringify({
        data: {
          activities: entries,
          pagination: { nextPage: hasMorePages ? page + 1 : null },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return new Response(JSON.stringify({ error: "Failed to load feed data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
