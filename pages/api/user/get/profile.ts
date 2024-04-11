import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/sound/get";
import { redis } from "@/lib/global/redis";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");
  const pageUserId = url.searchParams.get("pageUserId");

  if (!userId || !pageUserId) {
    console.log("Missing parameters");
    return new Response(
      JSON.stringify({ error: "Required parameters are missing." }),
      {
        status: 400,
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
    const cacheKey = `user:${pageUserId}:profile`;
    let pageUserData = await redis.get(cacheKey);

    if (!pageUserData) {
      // Cache miss
      const dbData = await prisma.user.findUnique({
        where: { id: pageUserId, status: "active" },
        select: {
          username: true,
          bio: true,
          essentials: { select: { apple_id: true } },
          _count: {
            select: {
              followers: true,
              entries: {
                where: {
                  type: "artifact",
                },
              },
            },
          },
        },
      });

      if (!dbData) {
        return new Response(JSON.stringify({ error: "User not found." }), {
          status: 404,
        });
      }

      await redis.hset(cacheKey, {
        id: pageUserId,
        username: dbData.username,
        bio: dbData.bio,
        followers: dbData._count.followers,
        entries: dbData._count.entries,
      });
    } else {
      // @ts-ignore
      pageUserData = JSON.parse(pageUserData);
    }

    // @ts-ignore
    pageUserData.essentials = await attachSoundData(pageUserData.essentials);

    let isFollowingAtoB = false;
    let isFollowingBtoA = false;

    // Determine follow status
    if (pageUserId !== userId) {
      // Check if the page user is following the session user
      let userFollowers = await redis.get(`user:${userId}:followers`);
      if (!userFollowers) {
        // Cache miss
        userFollowers = await prisma.user
          .findUnique({
            where: { id: userId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers || []);

        await redis.setex(`user:${userId}:followers`, 3600, userFollowers);
      } else {
        // @ts-ignore
        userFollowers = JSON.parse(userFollowers);
      }

      let pageUserFollowers = await redis.get(`user:${pageUserId}:followers`);
      if (!pageUserFollowers) {
        // Cache miss
        pageUserFollowers = await prisma.user
          .findUnique({
            where: { id: pageUserId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers || []);

        await redis.setex(
          `user:${pageUserId}:followers`,
          3600,
          pageUserFollowers,
        );
      } else {
        // @ts-ignore
        pageUserFollowers = JSON.parse(pageUserFollowers);
      }

      // @ts-ignore
      isFollowingBtoA = userFollowers.includes(pageUserId);
      // @ts-ignore
      isFollowingAtoB = pageUserFollowers.includes(userId);
    }

    return new Response(
      JSON.stringify({
        // @ts-ignore
        ...pageUserData,
        isFollowingAtoB,
        isFollowingBtoA,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Error fetching user." }), {
      status: 500,
    });
  }
}

async function attachSoundData(essentials: Essential[]) {
  if (essentials.length === 0) {
    return essentials;
  }

  const albumIds = essentials.map((e) => e.sound.appleId).join(",");
  const albumData = await fetchAndCacheSoundsByType(albumIds, "albums");
  const albumDataMap = Object.fromEntries(
    // @ts-ignore
    albumData.map((album) => [album.id, album]),
  );

  return essentials.map((essential) => ({
    ...essential,
    appleData: albumDataMap[essential.sound.appleId],
  }));
}

export const runtime = "edge";
