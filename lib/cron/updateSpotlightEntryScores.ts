import client from "../redis";
import { prisma } from "../prisma";
import { ReviewData } from "../interfaces";

// Weights for the trending score calculation
const weights = {
  views: 0.4,
  likes: 0.3,
  replies: 0.3,
};

// Function to calculate the trending score
function calculateSpotlightScore(entry: ReviewData) {
  const likesCount = entry.likes ? entry.likes.length : 0; // corrected line
  const repliesCount = entry.replies ? entry.replies.length : 0; // corrected line

  return (
    entry.viewsCount * weights.views +
    likesCount * weights.likes +
    repliesCount * weights.replies
  );
}

export async function updateSpotlightEntryScores() {
  const entries = await prisma.review.findMany();

  // Loop over each album and calculate the trending score
  for (const entry of entries) {
    const trendingScore = calculateSpotlightScore(entry);

    // Update the album with the new trending score in Redis
    await client.zadd("spotlightEntries", trendingScore, entry.id);

    console.log(
      `Updated album ${entry.id} /  with new spotlight score: ${trendingScore}`
    );
  }

  console.log("Entry spotlight scores updated successfully");
}
