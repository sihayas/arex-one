import {
  userHeartsKey,
  userNotifsKey,
  redis,
  entryDataKey,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { action, target, targetId, authorId, userId, soundId } =
    await req.body;

  if (authorId === userId) {
    return res.status(400).json({ success: "Cannot act on your own" });
  }

  const isEntry = target === "entry";
  const isChain = target === "chain";
  const key = `${target}_${action}|${targetId}`;

  try {
    const result = await prisma.action.create({
      data: {
        author_id: userId,
        type: action,
        ...(isEntry && { entry_id: targetId }),
        ...(isChain && { chain_id: targetId }),
      },
    });
    await prisma.activity.create({
      data: { author_id: userId, source_id: result.id, source_type: action },
    });
    const notification = await prisma.notification.create({
      data: {
        key: key,
        sender_id: userId,
        receiver_id: authorId,
        sound_id: soundId,
        source_id: result.id,
        source_type: action,
      },
    });

    // handle target author caches
    const pipeline = redis.pipeline();
    pipeline.zadd(userNotifsKey(authorId), {
      score: new Date(notification.created_at).getTime(),
      member: notification.id,
    });
    pipeline.hincrby(entryDataKey(targetId), "actions_count", 1);

    // handle user caches
    pipeline.sadd(userHeartsKey(userId), targetId); // + id to hearts
    await pipeline.exec();

    return res.status(200).json({ success: "Hearted successfully" });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ error: "Error creating action." });
  }
}
