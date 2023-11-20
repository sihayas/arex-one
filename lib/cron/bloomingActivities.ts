import client from "../global/redis";
import { prisma } from "../global/prisma";

interface Record {
  _count: {
    hearts: number;
    replies: number;
    views: number;
  };
  id: string;
  updatedAt: Date;
}

const weights = {
  views: 0.3,
  hearts: 0.2,
  replies: 0.2,
  recency: 0.3,
};

function calculateBloomingScore(record: Record) {
  const currentTime = new Date();
  const lastInteractionTime = new Date(record.updatedAt);
  const diffInMilliseconds =
    currentTime.getTime() - lastInteractionTime.getTime();
  const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

  const recencyScore = 1 / (diffInHours + 1);

  return (
    record._count.views * weights.views +
    record._count.hearts * weights.hearts +
    record._count.replies * weights.replies +
    recencyScore * weights.recency
  );
}

// Returns a list of activity IDs sorted by blooming score
export async function bloomingActivities() {
  const activities = await prisma.activity.findMany({
    where: {
      type: "RECORD",
    },
    include: {
      record: {
        select: {
          id: true,
          _count: {
            select: { replies: true, hearts: true, views: true },
          },
          updatedAt: true,
        },
      },
    },
  });

  for (const activity of activities) {
    if (activity.record) {
      const record = activity.record;
      const bloomingScore = calculateBloomingScore(record);
      await client.zadd("bloomingActivityIds", bloomingScore, activity.id);
      console.log(
        `Updated record ${record.id} /  with new trending score: ${bloomingScore}`,
      );
    }
  }

  console.log("RecordFeed blooming scores updated successfully");
}
