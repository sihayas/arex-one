import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import {
  entryHeartCountKey,
  userHeartsKey,
  userNotifsKey,
  userUnreadNotifsCount,
  redis,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";

export default async function onRequestPost(request: any) {
  const { targetId, userId, authorId, type, referenceType, soundId } =
    await request.json();

  if (authorId === userId) {
    return createResponse({ error: "Cannot act on your own." }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }

  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    const action = await prisma.action.create({
      data: {
        author_id: userId,
        reference_id: targetId,
        type: type,
        reference_type: referenceType,
      },
    });

    if (type === "heart") {
      const key = `heart|${soundId}|${targetId}|${userId}`;
      const activity = await prisma.activity.create({
        data: {
          author_id: userId,
          reference_id: action.id,
          type: "heart",
        },
      });
      const notification = await prisma.notification.create({
        data: {
          key: key,
          recipient_id: authorId,
          activity_id: activity.id,
        },
      });

      // Handle target author cache
      // Add to notifications cache
      await redis.zadd(userNotifsKey(authorId), {
        score: new Date(notification.created_at).getTime(),
        member: notification.id,
      });
      await redis.incr(userUnreadNotifsCount(authorId)); // Increment count
      await redis.incr(entryHeartCountKey(targetId)); // Increment count

      // Handle user cache
      await redis.sadd(userHeartsKey(userId), targetId); // + ID to hearts
    }
    return createResponse({ success: "Hearted successfully" }, 200);
  } catch (error) {
    console.error("Error creating heart:", error);
    return createResponse({ error: "Failed to create heart." }, 500);
  }
}

export const runtime = "edge";
