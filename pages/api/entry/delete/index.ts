import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/global/redis";

export async function onRequestPatch(request: any) {
  const { entryId, userId } = await request.json();

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
    // Mark the entry as deleted
    const deletedEntry = await prisma.entry.update({
      where: { id: entryId },
      data: { is_deleted: true },
    });

    if (!deletedEntry) {
      return new Response(JSON.stringify({ error: "Entry not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Update the feed cache of followers
    const cacheKey = `user:${userId}:followers`;
    const userFollowers = await redis.get(cacheKey);
    let followers: string[] | null = userFollowers
      ? //   @ts-ignore
        JSON.parse(userFollowers)
      : null;

    // If the followers are not cached, fetch them from the database
    if (!followers) {
      followers = await prisma.user
        .findUnique({
          where: { id: userId, status: "active" },
          select: {
            followers: {
              where: { is_deleted: false },
              select: { follower_id: true },
            },
          },
        })
        .then((u) => (u ? u.followers.map((f) => f.follower_id) : null));

      // No followers so no feeds to update, update user entries and return
      if (!followers) {
        await redis.zrem(`user:${userId}:entries`, entryId);
        return new Response(
          JSON.stringify({
            message: "Entry successfully marked as deleted.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      await redis.set(cacheKey, JSON.stringify(followers));
    }

    followers.push(userId);

    // Remove the entry from the feed of each follower
    const pipeline = redis.pipeline();
    followers.forEach((follower) => {
      pipeline.zrem(`user:${follower}:feed`, entryId);
    });
    // Remove the entry from the user's entries
    pipeline.zrem(`user:${userId}:entries`, entryId);
    await pipeline.exec();

    return new Response(
      JSON.stringify({
        message: "Entry successfully marked as deleted.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to mark the artifact as deleted:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update artifact status." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
