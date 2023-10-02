import client from "../global/redis";
import { prisma } from "../global/prisma";
import { ReviewData } from "../global/interfaces";

interface PrismaReviewData {
  id: string;
  _count: {
    replies: number;
    likes: number;
  };
  viewsCount: number;
  updatedAt: Date;
}

// Weights for the trending score calculation
const weights = {
  views: 0.3,
  likes: 0.2,
  replies: 0.2,
  recency: 0.3, // <-- Add this
};

function calculateBloomingScore(entry: PrismaReviewData) {
  const currentTime = new Date();
  const lastInteractionTime = new Date(entry.updatedAt);
  const diffInMilliseconds =
    currentTime.getTime() - lastInteractionTime.getTime();
  const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

  const recencyScore = 1 / (diffInHours + 1); // calculate recency score

  return (
    entry.viewsCount * weights.views +
    entry._count.likes * weights.likes +
    entry._count.replies * weights.replies +
    recencyScore * weights.recency
  );
}

export async function updateBloomingEntryScores() {
  const entries = await prisma.review.findMany({
    select: {
      id: true,
      _count: {
        select: { replies: true, likes: true },
      },
      viewsCount: true,
      updatedAt: true,
    },
  });

  for (const entry of entries) {
    const bloomingScore = calculateBloomingScore(entry);

    await client.zadd("bloomingEntries", bloomingScore, entry.id);

    console.log(
      `Updated entry ${entry.id} /  with new trending score: ${bloomingScore}`,
    );
  }

  console.log("FeedEntry blooming scores updated successfully");
}
