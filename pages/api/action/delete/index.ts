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
    return res.status(400).json({ error: "Cannot act on your own" });
  }

  const isEntry = targetType === "entry";

  try {
    const deletedAction = await prisma.action.update({
      where: {
        ...(isEntry
          ? {
              author_id_entry_id_type: {
                author_id: userId,
                entry_id: targetId,
                type: actionType,
              },
            }
          : {
              author_id_reply_id_type: {
                author_id: userId,
                reply_id: targetId,
                type: actionType,
              },
            }),
      },
      data: { is_deleted: true },
    });
    // Delete from database
    const deletedActivity = await prisma.activity.update({
      where: { action_id: deletedAction.id },
      data: { is_deleted: true },
    });
    const deletedNotification = await prisma.notification.update({
      where: { activity_id: deletedActivity.id },
      data: { is_deleted: true },
    });

    // Handle target author cache
    // Delete from notifications cache
    await redis.zrem(userNotifsKey(authorId), deletedNotification.id);
    await redis.decr(userUnreadNotifsCount(authorId)); // -1 to count
    await redis.decr(entryHeartCountKey(targetId)); // -1 to  count

    // Handle user cache
    await redis.srem(userHeartsKey(userId), targetId); // -IDs to hearts
    return res.status(200).json({ error: "Deleted action successfully" });
  } catch (error) {
    console.error("Error deleting action:", error);
    return res.status(500).json({ error: "Error deleting action." });
  }
}
