import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Notification, PrismaClient } from "@prisma/client";
import {
  userAggNotifsKey,
  userNotifsKey,
  userUnreadNotifsCount,
  redis,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";

interface AggregatedNotification {
  count: number;
  notifications: Notification[];
  images: { soundImageUrl: string; authorImageUrl: string }[];
}

interface NotificationAccumulator {
  [key: string]: AggregatedNotification;
}

export default async function onRequestGet(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  // const page = Number(url.searchParams.get("page")) || 1;
  // const limit = Number(url.searchParams.get("limit")) || 8;
  // const start = (page - 1) * limit;
  // const end = page * limit - 1;

  if (!userId) {
    return createResponse({ error: "Invalid userId" }, 400);
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  try {
    const unreadCount = parseInt(
      (await redis.get(userUnreadNotifsCount(userId))) || "0",
      10,
    );

    let notifs;

    if (unreadCount > 0) {
      const start = 0;
      const end = Math.min(unreadCount, 10) - 1;

      const limit = end - start + 1;

      // Retrieve at max 10 notifications from the sorted set cache
      let notificationIds: string[] = await redis.zrange(
        userNotifsKey(userId),
        start,
        end,
      );

      // Get notifications from the DB using the IDs
      const notifications: Notification[] = await prisma.notification.findMany({
        where: {
          recipient_id: userId,
          is_deleted: false,
          id: { in: notificationIds },
        },
        take: limit,
      });

      notifs = await groupNotifications(notifications, userId);

      await redis.decrby(userNotifsKey(userId), limit); // Decrement the unread count
      return createResponse({ data: notifs }, 200);
    }

    return createResponse({ data: notifs }, 200);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return createResponse({ error: "Error fetching notifications" }, 500);
  }
}

async function groupNotifications(
  notifications: Notification[],
  userId: string,
) {
  const accumulator: NotificationAccumulator = {};

  notifications.forEach((notif) => {
    if (!notif.key) return;

    const keyParts = notif.key.split("|");
    const type = keyParts[0];
    const targetId = keyParts[2];
    const aggregateKey = `${type}|${targetId}`;

    if (!accumulator[aggregateKey]) {
      accumulator[aggregateKey] = {
        count: 1,
        notifications: [notif], // Initialize with current notification
        images: [], // Array to store image URLs
      };
    } else {
      accumulator[aggregateKey].count++;
      accumulator[aggregateKey].notifications.push(notif);
    }
  });

  // Asynchronous fetching of image URLs
  for (let key in accumulator) {
    // Cache the aggregated notifications before fetching image URLs
    const aggData = accumulator[key];
    await redis.zadd(userAggNotifsKey(userId), {
      score: new Date(aggData.notifications[0].created_at).getTime(),
      member: JSON.stringify(aggData),
    });

    if (accumulator[key].images.length < 3) {
      const soundId = key.split("|")[1];
      const authorId = key.split("|")[3];
      const soundImageUrlKey = `sound:${soundId}:image`;
      const authorImageUrlKey = `author:${authorId}:image`;

      const pipeline = redis.pipeline();
      pipeline.get(soundImageUrlKey);
      pipeline.get(authorImageUrlKey);
      const results = await pipeline.exec();

      const soundResult: any = results[0];
      const authorResult: any = results[1];

      const soundImageUrl = soundResult[1];
      const authorImageUrl = authorResult[1];

      accumulator[key].images.push({
        soundImageUrl,
        authorImageUrl,
      });
    }
  }

  return accumulator;
}

export const runtime = "edge";
