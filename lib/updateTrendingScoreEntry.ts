import client from "./redis";
import { prisma } from "./prisma";
import { ReviewData } from "./interfaces";

// Weights for the trending score calculation
const weights = {
  views: 0.4,
  likes: 0.3,
  replies: 0.3,
};

// Function to calculate the trending score
function calculateTrendingScore(entry: ReviewData) {
  const likesCount = entry.likes ? entry.likes.length : 0; // corrected line
  const repliesCount = entry.replies ? entry.replies.length : 0; // corrected line

  return (
    entry.viewsCount * weights.views +
    likesCount * weights.likes +
    repliesCount * weights.replies
  );
}

export async function updateTrendingScoreEntry() {
  const entries = await prisma.review.findMany();

  // Loop over each album and calculate the trending score
  for (const entry of entries) {
    const trendingScore = calculateTrendingScore(entry);

    // Update the album with the new trending score in Redis
    await client.zadd("trendingEntries", trendingScore, entry.id);

    console.log(
      `Updated album ${entry.id} /  with new trending score: ${trendingScore}`
    );
  }

  console.log("Album trending scores updated successfully");
}
