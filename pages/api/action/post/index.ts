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
  const { action, target, targetId, authorId, userId } = await req.body;

  if (authorId === userId) {
    return res.status(400).json({ success: "Cannot act on your own" });
  }

  const isEntry = target === "entry";
  const isReply = target === "reply";

  try {
    const result = await prisma.action.create({
      data: {
        author_id: userId,
        type: action,
        ...(isEntry && { entry_id: targetId }),
        ...(isReply && { reply_id: targetId }),
      },
    });

    const key = `${action}|${targetId}`;
    const activity = await prisma.activity.create({
      data: { author_id: userId, action_id: result.id },
    });
    const notification = await prisma.notification.create({
      data: {
        key: key,
        recipient_id: authorId,
        activity_id: activity.id,
        author_id: userId,
      },
    });

    // handle target author caches
    const pipeline = redis.pipeline();
    pipeline.zadd(userNotifsKey(authorId), {
      score: new Date(notification.created_at).getTime(),
      member: notification.id,
    });
    pipeline.incr(userUnreadNotifsCount(authorId)); // increment count
    pipeline.incr(entryHeartCountKey(targetId)); // increment count
    // handle user caches
    pipeline.sadd(userHeartsKey(userId), targetId); // + id to hearts
    await pipeline.exec();

    return res.status(200).json({ success: "Hearted successfully" });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ error: "Error creating action." });
  }
}
