import client, { setCache } from "../global/redis";
import { prisma } from "../global/prisma";

type RecordCounts = {
  _count: {
    replies: number;
    hearts: number;
    views: number;
  };
  rating: number;
  loved: boolean;
  replay: boolean;
  createdAt: Date;
};

const weights = {
  views: 0.25,
  hearts: 0.15,
  replies: 0.15,
  recency: 0.25,
  loved: 0.1,
  replay: 0.1,
};

function calculateScore(record: RecordCounts) {
  const diffInHours =
    (new Date().getTime() - new Date(record.createdAt).getTime()) /
    1000 /
    60 /
    60;
  const recencyScore = 1 / Math.sqrt(diffInHours + 1);

  return (
    record._count.views * weights.views +
    record._count.hearts * weights.hearts +
    record._count.replies * weights.replies +
    recencyScore * weights.recency +
    Number(record.loved) * weights.loved +
    Number(record.replay) * weights.replay
  );
}

// Update the positive review rankings
export async function soundRankings(isNegative: boolean) {
  const ratingCondition = isNegative ? { lte: 2.5 } : { gt: 2.5 };
  const activities = await prisma.activity.findMany({
    where: {
      type: "RECORD",
      createdAt: {
        gte: new Date(new Date().getTime() - 48 * 60 * 60 * 1000),
      },
      record: {
        entry: {
          rating: ratingCondition,
        },
      },
    },
    include: {
      record: {
        select: {
          id: true,
          author: { select: { id: true, username: true, image: true } },
          album: { select: { id: true, appleId: true } },
          track: { select: { id: true, appleId: true } },
          entry: true,
          _count: { select: { replies: true, hearts: true, views: true } },
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  for (const activity of activities) {
    if (activity.record && activity.record.entry) {
      const record = activity.record;
      const recordCounts = {
        _count: {
          replies: record._count.replies,
          hearts: record._count.hearts,
          views: record._count.views,
        },
        rating: activity.record.entry.rating,
        loved: activity.record.entry.loved,
        replay: activity.record.entry.replay,
        createdAt: activity.record.createdAt,
      };
      const contextKey = record.album?.id
        ? `album:${record.album.id}`
        : `track:${record.track?.id}`;
      if (!contextKey) continue;

      const key = isNegative
        ? `${contextKey}:activity:record:positive:score`
        : `${contextKey}:activity:record:negative:score`;

      await client.zadd(key, calculateScore(recordCounts), activity.id);
      await setCache(`activity:record:data:${activity.id}`, activity, 3600);
      console.log(`Updated score for activity ${activity.id}`);
    }
  }

  console.log("Positive review scores updated successfully");
}
