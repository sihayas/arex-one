import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { cacheEntries } from "@/pages/api/cache/entries";
import { redis } from "@/lib/global/redis";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const userId = searchParams.get("userId");
  const pageUserId = searchParams.get("pageUserId");

  if (!userId || !pageUserId) {
    console.log("Missing parameters");
    return new Response(
      JSON.stringify({ error: "Required parameters are missing." }),
      {
        status: 400,
      },
    );
  }
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;

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
    const entriesKey = `user:${userId}:entries`;

    const start = (page - 1) * limit;
    const end = page * limit - 1;

    // Fetch entry IDs from cache
    let entryIds = await redis.zrange(entriesKey, start, end, {
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
        return new Response(
          JSON.stringify({
            data: {
              activities: [],
              pagination: { nextPage: null },
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const pipeline = redis.pipeline();
      entries.forEach((entry) => {
        const unixTimestamp = new Date(entry.created_at).getTime();
        pipeline.zadd(`user:${entry.author_id}:entries`, {
          score: unixTimestamp,
          member: entry.id,
        });
      });
      await pipeline.exec();

      entryIds = await redis.zrange(`user:${userId}:entries`, 0, -1, {
        rev: true,
      });
    }

    // Pagination
    const totalEntries = await redis.zcard(entriesKey);
    const hasMorePages = totalEntries > end + 1;
    if (hasMorePages) entryIds.pop();

    // User has entries, fetch the entries from the cache
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

      // Merge the cached entries with the DB entries
      entries = entries.map(
        (entry, index) =>
          entry || dbEntries.find((dbEntry) => dbEntry.id === entryIds[index]),
      );
    }

    if (pageUserId !== userId) {
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
          const entryIds = user.hearts.map((heart) => heart.entry_id);
          await redis.sadd(heartsKey, ...entryIds);
        }
      }

      // Attach heartedByUser property to each entry
      hearts.length &&
        entries.forEach((entry) => {
          entry.heartedByUser = hearts.includes(entry.id);
        });
    }

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
    console.error("Error fetching user entries:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching user entries." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
