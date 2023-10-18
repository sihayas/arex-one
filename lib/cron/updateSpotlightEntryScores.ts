import client from "../global/redis";
import { prisma } from "../global/prisma";

interface PrismaReviewData {
  id: string;
  _count: {
    replies: number;
    likes: number;
  };
  viewsCount: number;
}

// Weights for the trending score calculation
const weights = {
  views: 0.4,
  likes: 0.3,
  replies: 0.3,
};

// Function to calculate the trending score
function calculateSpotlightScore(entry: PrismaReviewData) {
  return (
    entry.viewsCount * weights.views +
    entry._count.likes * weights.likes +
    entry._count.replies * weights.replies
  );
}

export async function updateSpotlightEntryScores() {
  const entries = await prisma.review.findMany({
    select: {
      id: true,
      _count: {
        select: { replies: true, likes: true },
      },
      viewsCount: true,
    },
  });

  // Loop over each entry and calculate the trending score
  for (const entry of entries) {
    const trendingScore = calculateSpotlightScore(entry);

    // Update the entry with the new trending score in Redis
    await client.zadd("spotlightEntries", trendingScore, entry.id);

    console.log(
      `Updated entry ${JSON.stringify(
        entry,
      )} / with new spotlight score: ${trendingScore}`,
    );
  }

  console.log("RecordEntry spotlight scores updated successfully");
}
