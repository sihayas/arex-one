import { prisma } from "@/lib/global/prisma";

import { userAggNotifsKey, userNotifsKey, redis } from "@/lib/global/redis";
import { NextApiRequest, NextApiResponse } from "next";

interface AggregatedNotification {
  count: number;
  notifications: string[];
  authors: string[];
  soundId: string;
  sourceId: string;
  source_type: string;
  lastTimestamp: Date;
}

interface NotificationAccumulator {
  [key: string]: AggregatedNotification;
}

interface NotificationResponse {
  id: string;
  key: string;
  sender_id: string;
  sound_id: string;
  source_id: string;
  source_type: string; // entry_heart, chain_heart, entry_flag, chain_flag,
  // chain
  created_at: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Array.isArray(req.query.userId)
    ? req.query.userId[0]
    : req.query.userId;

  const cursor = Number(req.query.cursor) || 0;

  if (!userId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const unreadCount = await redis.zcard(userNotifsKey(userId));

    let notifs;

    if (unreadCount > 0) {
      // there are unread notifications, fetch IDs from sorted set
      const limit = Math.min(unreadCount, 24);
      let notificationIds: string[] = await redis.zrange(
        userNotifsKey(userId),
        cursor,
        cursor + limit - 1,
      );

      console.log("notifs", notificationIds);

      // fetch notification details from the database
      const notifications = await prisma.notification.findMany({
        where: { is_deleted: false, id: { in: notificationIds } },
        select: {
          id: true,
          key: true,
          sender_id: true,
          sound_id: true,
          source_id: true,
          source_type: true,
          created_at: true,
        },
      });

      console.log("notifs", notifications);

      // aggregate notifications and cache the results
      const batchedNotifications = await batchNotifs(notifications, userId);
      notifs = batchedNotifications.accumulator;

      const newCursor = batchedNotifications.lastTimestamp;
      return res.status(200).json({ notifs: notifs, cursor: newCursor });
    }

    if (!unreadCount) {
      // no unread notifications, fetch from cached aggregated notifications
      const limit = 12;
      const cachedAggregatedNotifs = await redis.zrange(
        userAggNotifsKey(userId),
        cursor + 0.001,
        "+inf",
        { byScore: true, offset: 0, count: limit },
      );

      // if there are cached aggregated notifications, return them
      if (cachedAggregatedNotifs.length) {
        notifs = cachedAggregatedNotifs.map((aggregatedNotif: any) => {
          return JSON.parse(aggregatedNotif) as AggregatedNotification;
        });

        const newCursor =
          notifs.length > 0
            ? notifs[cachedAggregatedNotifs.length - 1].lastTimestamp
            : cursor;

        return res.status(200).json({ notifs: notifs, cursor: newCursor });
      }
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error fetching notifications." });
  }
}

async function batchNotifs(notifs: NotificationResponse[], userId: string) {
  const { accumulator, lastTimestamp } = notifs.reduce(
    ({ accumulator, lastTimestamp }, notif) => {
      const key = notif.key;

      if (!accumulator[key]) {
        accumulator[key] = {
          count: 1,
          notifications: [notif.id],
          authors: [],
          soundId: notif.sound_id,
          sourceId: notif.source_id,
          source_type: notif.source_type,
          lastTimestamp: notif.created_at,
        };
      } else {
        accumulator[key].notifications.push(notif.id);
        accumulator[key].count++;
        if (accumulator[key].count < 3) {
          accumulator[key].authors.push(notif.sender_id);
        }
      }

      return {
        accumulator,
        lastTimestamp: Math.max(
          lastTimestamp,
          new Date(accumulator[key].lastTimestamp).getTime(),
        ),
      };
    },
    { accumulator: {} as NotificationAccumulator, lastTimestamp: 0 },
  );

  for (let batchKey in accumulator) {
    const aggNotifs = accumulator[batchKey];
    const timestamp = new Date(aggNotifs.lastTimestamp).getTime();
    // cache aggregated notifications
    await redis.zadd(userAggNotifsKey(userId), {
      score: timestamp,
      member: JSON.stringify(aggNotifs),
    });
  }

  return { accumulator, lastTimestamp };
}
