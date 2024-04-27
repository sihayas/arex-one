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
  const { action, target, targetId, authorId, userId } = await req.body;

  if (authorId === userId) {
    return res.status(400).json({ error: "Cannot act on your own" });
  }

  const isEntry = target === "entry";

  try {
    // delete from database
    // update action to mark as deleted
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
              author_id_chain_id_type: {
                author_id: userId,
                chain_id: targetId,
                type: action,
              },
            }),
      },
      data: { is_deleted: true },
    });

    const deletedNotification = await prisma.notification.update({
      where: {
        sender_id_receiver_id_source_id_source_type: {
          sender_id: userId,
          receiver_id: authorId,
          source_id: deletedAction.id,
          source_type: action,
        },
      },
      data: { is_deleted: true },
    });

    // handle target author caches
    const pipeline = redis.pipeline();
    pipeline.zrem(userNotifsKey(authorId), deletedNotification.id);
    pipeline.hincrby(entryDataKey(targetId), "actions_count", -1);
    // handle user caches
    pipeline.srem(userHeartsKey(userId), targetId); // -id to hearts
    await pipeline.exec();
    return res.status(200).json({ error: "Deleted action successfully" });
  } catch (error) {
    console.error("Error deleting action:", error);
    return res.status(500).json({ error: "Error deleting action." });
  }
}
