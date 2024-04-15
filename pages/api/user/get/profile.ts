import { fetchAndCacheSoundsByType } from "@/pages/api/sound/get";
import {
  userFollowersKey,
  userProfileKey,
  redis,
  userImageKey,
} from "@/lib/global/redis";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Sound } from "@prisma/client";
import { createResponse } from "@/pages/api/middleware";

export type PipelineResponse = [Error | null, any][];

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
    if (!isOwnProfile) {
      pipeline.get(userFollowersKey(userId));
      pipeline.get(userFollowersKey(pageUserId));
    }

    const results: PipelineResponse = await pipeline.exec();

    let [pageUserProfileErr, pageUserProfile] = results[0];
    let [userImageErr, userImage] = results[1];
    let [userFollowersErr, userFollowers] = results[2] || [null, null];
    let [pageUserFollowersErr, pageUserFollowers] = results[3] || [null, null];

    // Get profile data
    if (pageUserProfile) {
      pageUserProfile = JSON.parse(pageUserProfile);
    } else {
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
          follow_notifications: true,
          heart_notifications: true,
          reply_notifications: true,
        },
      });

      if (!dbData) {
        return createResponse({ error: "User not found in DB." }, 404);
      }

      // Cache aside user profile
      await redis.hset(userProfileKey(pageUserId), {
        id: pageUserId,
        username: dbData.username,
        bio: dbData.bio,
        followers_count: dbData._count.followers,
        entries_count: dbData._count.entries,
        essentials: JSON.stringify(dbData.essentials),
      });
    }

    // Determine follow status
    let isFollowingAtoB = false;
    let isFollowingBtoA = false;

    if (!isOwnProfile) {
      // Cache aside user followers
      if (userFollowers) {
        userFollowers = JSON.parse(userFollowers);
      } else {
        userFollowers = await prisma.user
          .findUnique({
            where: { id: userId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers.map((follower) => follower.id) || []);

        await redis.set(
          userFollowersKey(userId),
          JSON.stringify(userFollowers),
        );
      }

      // Cache aside page user followers
      if (pageUserFollowers) {
        pageUserFollowers = JSON.parse(pageUserFollowers);
      } else {
        pageUserFollowers = await prisma.user
          .findUnique({
            where: { id: pageUserId },
            select: { followers: { select: { id: true } } },
          })
          .then((u) => u?.followers.map((follower) => follower.id) || []);

        await redis.set(
          userFollowersKey(pageUserId),
          JSON.stringify(pageUserFollowers),
        );
      }

      isFollowingBtoA = userFollowers.includes(pageUserId);
      isFollowingAtoB = pageUserFollowers.includes(userId);
    }

    // Attach sound data to essentials
    pageUserProfile.essentials = await attachSoundData(
      pageUserProfile.essentials,
    );

    return new Response(
      JSON.stringify({
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

async function attachSoundData(essentials: Sound[]) {
  if (essentials.length === 0) {
    return essentials;
  }

  const albumData = await fetchAndCacheSoundsByType(
    essentials.map((sound) => sound.apple_id).join(","),
    "albums",
  );

  const albumDataMap = Object.fromEntries(
    albumData.map((album: any) => [album.id, album]),
  );

  return essentials.map((sound) => ({
    ...sound,
    appleData: albumDataMap[sound.apple_id],
  }));
}

export const runtime = "edge";
