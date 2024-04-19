import {
  entryHeartCountKey,
  userHeartsKey,
  userNotifsKey,
  userUnreadNotifsCount,
  redis,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";
import { prisma } from "@/lib/global/prisma";

export default async function onRequestPost(request: any) {
  const { targetId, userId, authorId, actionType, targetType, soundId } =
    await request.json();

  if (authorId === userId) {
    return createResponse({ error: "Cannot act on your own." }, 400);
  }

  const isEntry = targetType === "entry";
  const isReply = targetType === "reply";

  try {
    const action = await prisma.action.create({
      data: {
        author_id: userId,
        type: actionType,
        ...(isEntry && { entry_id: targetId }),
        ...(isReply && { reply_id: targetId }),
      },
    });

    if (actionType === "heart") {
      const key = `heart_${targetType}|${targetId}|${soundId}`;
      const activity = await prisma.activity.create({
        data: { author_id: userId, action_id: action.id },
      });
      const notification = await prisma.notification.create({
        data: {
          key: key,
          recipient_id: authorId,
          activity_id: activity.id,
          author_id: userId,
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
