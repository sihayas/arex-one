import {
  entryHeartCountKey,
  userHeartsKey,
  userNotifsKey,
  userUnreadNotifsCount,
  redis,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { targetId, userId, authorId, actionType, targetType, soundId } =
    await req.body();

  if (authorId === userId) {
    return res.status(400).json({ success: "Cannot act on your own" });
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
    return res.status(200).json({ success: "Hearted successfully" });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ error: "Error creating action." });
  }
}
