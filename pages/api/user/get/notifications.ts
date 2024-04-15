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
  type: string;
  soundId: string;
  targetId: string;
  content: string;
  count: number;
  notifications: string[];
  authors: string[];
  lastTimestamp: Date;
}

interface NotificationAccumulator {
  [key: string]: AggregatedNotification;
}

interface NotificationResponse {
  id: string;
  key: string | null;
  author_id: string;
  created_at: Date;
  activity: {
    action: {
      type: string;
      reply: { text: string } | null;
      entry: { rating: number | null } | null;
    } | null;
    reply: { text: string } | null;
  };
}

export default async function onRequestGet(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const cursor = parseFloat(searchParams.get("cursor") || "0");

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

    if (unreadCount) {
      // There are unread notifications, fetch IDs from sorted set
      const limit = Math.min(unreadCount, 24);
      let notificationIds: string[] = await redis.zrange(
        userNotifsKey(userId),
        cursor,
        cursor + limit - 1,
      );

      // Fetch notification details from the database
      const notifications = await prisma.notification.findMany({
        where: {
          is_deleted: false,
          id: { in: notificationIds },
        },
        select: {
          id: true,
          created_at: true,
          author_id: true,
          key: true,
          activity: {
            select: {
              reply: {
                select: {
                  text: true,
                },
              },
              action: {
                select: {
                  type: true,
                  reply: {
                    select: {
                      text: true,
                    },
                  },
                  entry: {
                    select: {
                      rating: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Aggregate notifications and cache the results
      const aggregatedNotifs = await batchNotifs(notifications, userId);
      notifs = aggregatedNotifs.accumulator;
      const newCursor = aggregatedNotifs.lastTimestamp; // Cursor

      await redis.decrby(userUnreadNotifsCount(userId), notificationIds.length);
      return createResponse({ data: notifs, cursor: newCursor }, 200);
    }

    if (!unreadCount) {
      // No unread notifications, fetch from cached aggregated notifications
      const limit = 12;
      const cachedAggregatedNotifs = await redis.zrange(
        userAggNotifsKey(userId),
        cursor + 0.001,
        "+inf",
        { byScore: true, offset: 0, count: limit },
      );

      notifs = cachedAggregatedNotifs.map((aggregatedNotif: any) => {
        return JSON.parse(aggregatedNotif) as AggregatedNotification;
      });

      const newCursor =
        notifs.length > 0
          ? notifs[cachedAggregatedNotifs.length - 1].lastTimestamp
          : cursor;
      return createResponse({ data: notifs, cursor: newCursor }, 200);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return createResponse({ error: "Error fetching notifications" }, 500);
  }
}

async function batchNotifs(notifs: NotificationResponse[], userId: string) {
  const contentLookup: {
    [key: string]: (notif: NotificationResponse) => string;
  } = {
    reply: (notif: NotificationResponse) => notif.activity!.reply!.text,
    heart_entry: (notif: NotificationResponse) =>
      notif.activity!.action!.entry!.rating!.toString(),
    heart_reply: (notif: NotificationResponse) =>
      notif.activity!.action!.reply!.text,
  };

  const { accumulator, lastTimestamp } = notifs.reduce(
    ({ accumulator, lastTimestamp }, notif) => {
      const batchKey = notif.key;
      if (!batchKey) return { accumulator, lastTimestamp };

      const [type, targetId, soundId] = batchKey.split("|");
      const authorId = notif.author_id;

      if (!accumulator[batchKey]) {
        accumulator[batchKey] = {
          count: 1,
          type: type,
          authors: [],
          soundId: soundId,
          notifications: [],
          targetId: targetId,
          content: contentLookup[type] ? contentLookup[type](notif) : "",
          lastTimestamp: notif.created_at,
        };
      } else {
        accumulator[batchKey].notifications.push(notif.id);
        accumulator[batchKey].count++;
        if (accumulator[batchKey].count < 3) {
          accumulator[batchKey].authors.push(authorId);
        }
      }

      return {
        accumulator,
        lastTimestamp: Math.max(
          lastTimestamp,
          new Date(accumulator[batchKey].lastTimestamp).getTime(),
        ),
      };
    },
    { accumulator: {} as NotificationAccumulator, lastTimestamp: 0 },
  );

  for (let batchKey in accumulator) {
    const aggNotifs = accumulator[batchKey];
    const timestamp = new Date(aggNotifs.lastTimestamp).getTime();
    await redis.zadd(userAggNotifsKey(userId), {
      score: timestamp,
      member: JSON.stringify(aggNotifs),
    });
  }

  return { accumulator, lastTimestamp };
}

export const runtime = "edge";
