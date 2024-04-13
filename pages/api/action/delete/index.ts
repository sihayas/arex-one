import { PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
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
    return createResponse({ error: "Can't act on your own." }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }

  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    const deletedAction = await prisma.action.update({
      where: {
        author_id_reference_id_type_reference_type: {
          author_id: userId,
          reference_id: targetId,
          type: type,
          reference_type: referenceType,
        },
      },
      data: { is_deleted: true },
    });

    if (type === "heart") {
      // Delete from database
      const deletedActivity = await prisma.activity.update({
        where: {
          reference_id_type_author_id: {
            reference_id: deletedAction.id,
            type: "heart",
            author_id: userId,
          },
        },
        data: { is_deleted: true },
      });
      const deletedNotification = await prisma.notification.update({
        where: {
          recipient_id_activity_id: {
            recipient_id: authorId,
            activity_id: deletedActivity.id,
          },
        },
        data: { is_deleted: true },
      });

      // Handle target author cache
      // Delete from notifications cache
      await redis.zrem(userNotifsKey(authorId), deletedNotification.id);
      await redis.decr(userUnreadNotifsCount(authorId)); // -1 to count
      await redis.decr(entryHeartCountKey(targetId)); // -1 to  count

      // Handle user cache
      await redis.srem(userHeartsKey(userId), targetId); // -IDs to hearts
    }
    return createResponse({ success: "Un-hearted successfully" }, 200);
  } catch (error) {
    console.error("Error deleting heart:", error);
    return createResponse({ error: "Failed to delete heart." }, 500);
  }
}

export const runtime = "edge";
