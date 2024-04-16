import { D1Database } from "@cloudflare/workers-types";
import { createResponse } from "@/pages/api/middleware";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { redis, userProfileKey } from "@/lib/global/redis";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return createResponse({ error: "Missing userId." }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    let userProfile = await redis.hgetall(userProfileKey(userId));

    // Get profile data
    if (userProfile) {
      // @ts-ignore
      userProfile = JSON.parse(userProfile);
    } else {
      // Cache miss
      const dbData = await prisma.user.findUnique({
        where: { id: userId, status: "active" },
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
      await redis.hset(userProfileKey(userId), {
        id: userId,
        image: dbData.image,
        username: dbData.username,
        bio: dbData.bio,
        essentials: JSON.stringify(dbData.essentials),
        followers_count: dbData._count.followers,
        entries_count: dbData._count.entries,
        follow_notifications: dbData.follow_notifications,
        heart_notifications: dbData.heart_notifications,
        reply_notifications: dbData.reply_notifications,
      });
    }

    if (!userProfile) {
      return createResponse({ error: "User not found in cache." }, 404);
    }

    const settings = {
      follow_notifications: userProfile.follow_notifications,
      heart_notifications: userProfile.heart_notifications,
      reply_notifications: userProfile.reply_notifications,
    };

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new Response("Error fetching settings.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const runtime = "edge";
