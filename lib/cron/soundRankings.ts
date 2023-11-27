import client, { setCache } from "../global/redis";
import { prisma } from "../global/prisma";

type RecordCounts = {
  _count: {
    replies: number | null;
    hearts: number | null;
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
    // record._count.views * weights.views +
    // record._count?.hearts? * weights.hearts +
    // record._count?.replies? * weights.replies +
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
      type: "artifact",
      createdAt: {
        gte: new Date(new Date().getTime() - 48 * 60 * 60 * 1000),
      },
      artifact: {
        content: {
          rating: ratingCondition,
        },
      },
    },
    include: {
      artifact: {
        select: {
          id: true,
          author: { select: { id: true, username: true, image: true } },
          _count: { select: { replies: true, hearts: true } },
          createdAt: true,
          updatedAt: true,
          content: true,
          sound: true,
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
        },
        rating: activity.artifact.content.rating,
        loved: activity.artifact.content.loved,
        replay: activity.artifact.content.replay,
        createdAt: activity.artifact.createdAt,
      };
      const contextKey =
        artifact.sound.type === "albums"
          ? `album:${artifact.sound.id}`
          : `track:${artifact.sound.id}`;
      if (!contextKey) continue;

      const key = isNegative
        ? `${contextKey}:activity:record:positive:score`
        : `${contextKey}:activity:record:negative:score`;

      await client.zadd(key, calculateScore(artifactCounts), activity.id);
      await setCache(`activity:record:data:${activity.id}`, activity, 3600);
      console.log(`Updated score for activity ${activity.id}`);
    }
  }

  console.log("Positive review scores updated successfully");
}
