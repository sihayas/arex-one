import { fetchAndCacheSoundsByType } from "@/pages/api/sound/get";
import { userFollowersKey, userProfileKey, redis } from "@/lib/global/redis";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Sound } from "@prisma/client";
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
    if (!isOwnProfile) {
      pipeline.get(userFollowersKey(userId));
      pipeline.get(userFollowersKey(pageUserId));
    }

    const results = await pipeline.exec();

    let pageUserProfileErr,
      pageUserProfile,
      userFollowersErr,
      userFollowers,
      pageUserFollowersErr,
      pageUserFollowers;

    if (Array.isArray(results[0])) {
      [pageUserProfileErr, pageUserProfile] = results[0];
    }

    if (Array.isArray(results[2])) {
      [userFollowersErr, userFollowers] = results[2];
    }

    if (Array.isArray(results[3])) {
      [pageUserFollowersErr, pageUserFollowers] = results[3];
    }

    // Get profile data
    if (pageUserProfile) {
      pageUserProfile = JSON.parse(pageUserProfile);
    } else {
      const dbData = await prisma.user.findUnique({
        where: { id: pageUserId, status: "active" },
        select: {
          id: true,
          image: true,
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
        image: dbData.image,
        username: dbData.username,
        bio: dbData.bio,
        essentials: JSON.stringify(dbData.essentials),
        _count: JSON.stringify(dbData._count),
        follow_notifications: dbData.follow_notifications,
        heart_notifications: dbData.heart_notifications,
        reply_notifications: dbData.reply_notifications,
      });

      pageUserProfile = {
        id: pageUserId,
        image: dbData.image,
        username: dbData.username,
        bio: dbData.bio,
        essentials: dbData.essentials,
        _count: dbData._count,
        follow_notifications: dbData.follow_notifications,
        heart_notifications: dbData.heart_notifications,
        reply_notifications: dbData.reply_notifications,
      };
    }

    // Determine follow status
    let isFollowingAtoB = false;
    let isFollowingBtoA = false;

    // Cache aside user followers
    if (userFollowers && !isOwnProfile) {
      userFollowers = JSON.parse(userFollowers);
    } else {
      userFollowers = await prisma.user
        .findUnique({
          where: { id: userId },
          select: { followers: { select: { id: true } } },
        })
        .then((u) =>
          u && u.followers ? u.followers.map((follower) => follower.id) : [],
        );

      if (userFollowers) {
        await redis.set(
          userFollowersKey(userId),
          JSON.stringify(userFollowers),
        );
      }
    }

    // Cache aside page user followers
    if (pageUserFollowers && !isOwnProfile) {
      pageUserFollowers = JSON.parse(pageUserFollowers);
    } else {
      pageUserFollowers = await prisma.user
        .findUnique({
          where: { id: pageUserId },
          select: { followers: { select: { id: true } } },
        })
        .then((u) =>
          u && u.followers ? u.followers.map((follower) => follower.id) : [],
        );

      if (pageUserFollowers) {
        await redis.set(
          userFollowersKey(pageUserId),
          JSON.stringify(pageUserFollowers),
        );
      }
    }

    isFollowingBtoA = userFollowers.includes(pageUserId);
    isFollowingAtoB = pageUserFollowers.includes(userId);

    // Attach sound data to essentials
    pageUserProfile.essentials = await attachSoundData(
      pageUserProfile.essentials,
    );

    return createResponse(
      { ...pageUserProfile, isFollowingAtoB, isFollowingBtoA },
      200,
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return createResponse({ error: "Error fetching user profile:" }, 500);
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

  const albumDataMap = albumData
    ? Object.fromEntries(albumData.map((album: any) => [album.id, album]))
    : {};

  return essentials
    ? essentials.map((sound) => ({
        ...sound,
        appleData: albumDataMap[sound.apple_id],
      }))
    : [];
}

export const runtime = "edge";
