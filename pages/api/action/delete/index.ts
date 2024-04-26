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
    return res.status(400).json({ error: "Cannot act on your own" });
  }

  const isEntry = target === "entry";

  try {
    // delete from database
    const result = await prisma.$transaction(async (prisma) => {
      // Update action to mark as deleted
      const deletedAction = await prisma.action.update({
        where: {
          ...(isEntry
            ? {
                author_id_entry_id_type: {
                  author_id: userId,
                  entry_id: targetId,
                  type: action,
                },
              }
            : {
                author_id_reply_id_type: {
                  author_id: userId,
                  reply_id: targetId,
                  type: action,
                },
              }),
        },
        data: { is_deleted: true },
      });
      // Update related activity
      const deletedActivity = await prisma.activity.update({
        where: { action_id: deletedAction.id },
        data: { is_deleted: true },
      });
      // Update notification
      const deletedNotification = await prisma.notification.update({
        where: { activity_id: deletedActivity.id },
        data: { is_deleted: true },
      });

      return { deletedAction, deletedActivity, deletedNotification };
    });

    // handle target author caches
    const pipeline = redis.pipeline();
    pipeline.zrem(userNotifsKey(authorId), result.deletedNotification.id);
    pipeline.decr(userUnreadNotifsCount(authorId)); // -1 to count
    pipeline.decr(entryHeartCountKey(targetId)); // -1 to  count
    // handle user caches
    pipeline.srem(userHeartsKey(userId), targetId); // -id to hearts
    await pipeline.exec();
    return res.status(200).json({ error: "Deleted action successfully" });
  } catch (error) {
    console.error("Error deleting action:", error);
    return res.status(500).json({ error: "Error deleting action." });
  }
}
