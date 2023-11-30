import client, { setCache } from "../global/redis";
import { prisma } from "../global/prisma";

type RecordCounts = {
  _count: {
    replies: number;
    hearts: number;
    views: number;
  };
  rating: number | null;
  loved: boolean | null;
  replay: boolean | null;
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

// Update the positive/negative entry rankings for a sound of a given type
export async function soundRankings(
  isNegative: boolean,
  soundId: string,
  type: string,
) {
  const ratingCondition = isNegative ? { lte: 2.5 } : { gt: 2.5 };
  const activities = await prisma.activity.findMany({
    where: {
      type: "artifact",
      createdAt: {
        gte: new Date(new Date().getTime() - 48 * 60 * 60 * 1000),
      },
      artifact: {
        type: "entry",
        content: {
          rating: ratingCondition,
        },
        sound: {
          appleId: soundId,
        },
      },
    },
    select: {
      id: true,
      artifact: {
        select: {
          _count: { select: { replies: true, hearts: true, views: true } },
          content: {
            select: { rating: true, loved: true, replay: true },
          },
          createdAt: true,
        },
      },
    },
  });

  for (const activity of activities) {
    if (activity.artifact && activity.artifact.content) {
      const artifact = activity.artifact;
      const artifactCounts = {
        _count: {
          replies: artifact._count.replies,
          hearts: artifact._count.hearts,
          views: artifact._count.views,
        },

        rating: activity.artifact.content.rating,
        loved: activity.artifact.content.loved,
        replay: activity.artifact.content.replay,
        createdAt: activity.artifact.createdAt,
      };

      const key = isNegative
        ? `sound:${type}:${soundId}:critical:score`
        : `sound:${type}:${soundId}:positive:score`;

      await client.zadd(key, calculateScore(artifactCounts), activity.id);

      console.log(`Updated score for activity ${activity.id}`);
    }
  }

  console.log("Positive review scores updated successfully");
}
