import client, { setCache } from "../global/redis";
import { prisma } from "../global/prisma";
import { Artifact } from "@/types/dbTypes";

type SelectedRecordFields = Pick<
  Artifact,
  "id" | "updatedAt" | "type" | "author" | "createdAt" | "sound"
> & {
  _count: {
    replies: number;
    hearts: number;
    views: number;
  };
};

const weights = {
  views: 0.3,
  hearts: 0.2,
  replies: 0.2,
  recency: 0.3,
};

function calculateBloomingScore(record: SelectedRecordFields) {
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
export async function rankBlooming() {
  const activities = await prisma.activity.findMany({
    where: {
      type: "artifact",
    },
    include: {
      artifact: {
        select: {
          id: true,
          type: true,
          author: true,
          _count: { select: { replies: true, hearts: true } },
          content: true,
          sound: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  for (const activity of activities) {
    if (activity.artifact) {
      const artifact = activity.artifact;
      // @ts-ignore
      const bloomingScore = calculateBloomingScore(artifact);
      // Add blooming score to sorted set, and cache activity data
      await client.zadd(
        `activity:artifact:blooming:score`,
        bloomingScore,
        activity.id,
      );
      await setCache(`activity:artifact:data:${activity.id}`, activity, 3600);
    }
  }

  console.log("RecordFeed blooming scores updated successfully");
}
