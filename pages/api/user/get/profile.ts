import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/sound/get";
import {
  userFollowersKey,
  userProfileKey,
  redis,
  userImageKey,
} from "@/lib/global/redis";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { createResponse } from "@/pages/api/middleware";

export default async function onRequestGet(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const pageUserId = searchParams.get("pageUserId");
  const isOwnProfile = userId === pageUserId;

  if (!userId || !pageUserId) {
    return createResponse({ error: "Missing userId or pageUserId" }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    const pipeline = redis.pipeline();
    pipeline.hgetall(userProfileKey(pageUserId));
    pipeline.get(userImageKey(pageUserId));
    isOwnProfile && pipeline.get(userFollowersKey(userId));
    isOwnProfile && pipeline.get(userFollowersKey(pageUserId));
    let [pageUserProfile, userImage, userFollowers, pageUserFollowers] =
      await pipeline.exec();

    if (!pageUserProfile) {
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
        return createResponse({ error: "User not found in DB." }, 404);
      }

      await redis.hset(userProfileKey(pageUserId), {
        id: pageUserId,
        username: dbData.username,
        bio: dbData.bio,
        followers_count: dbData._count.followers,
        entries_count: dbData._count.entries,
        essentials: JSON.stringify(dbData.essentials),
      });
    } else {
      // @ts-ignore
      pageUserProfile = JSON.parse(pageUserData);
    }

    // @ts-ignore
    pageUserProfile.essentials = await attachSoundData(pageUserData.essentials);

    let isFollowingAtoB = false;
    let isFollowingBtoA = false;

    // Determine follow status
    if (!isOwnProfile) {
      // Check if the page user is following the session user
      if (!userFollowers) {
        // Cache miss
        userFollowers = await prisma.user
          .findUnique({
            where: { id: userId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers || []);

        await redis.set(`user:${userId}:followers`, userFollowers);
      } else {
        // @ts-ignore
        userFollowers = JSON.parse(userFollowers);
      }

      if (!pageUserFollowers) {
        // Cache miss
        pageUserFollowers = await prisma.user
          .findUnique({
            where: { id: pageUserId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers || []);

        await redis.setex(
          userFollowersKey(pageUserId),
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
        ...pageUserProfile,
        isFollowingAtoB,
        isFollowingBtoA,
        userImage,
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
