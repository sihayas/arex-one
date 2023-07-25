import client from "./redis";
import { prisma } from "./prisma";
import { ReviewData } from "./interfaces";

// Weights for the trending score calculation
const weights = {
  views: 0.3,
  likes: 0.2,
  replies: 0.2,
  recency: 0.3, // <-- Add this
};

function calculateBloomingScore(entry: ReviewData) {
  const likesCount = entry.likes ? entry.likes.length : 0;
  const repliesCount = entry.replies ? entry.replies.length : 0; // corrected line

  const currentTime = new Date();
  const lastInteractionTime = new Date(entry.updatedAt); // assuming lastInteractionTime is in ISO string format
  const diffInMilliseconds =
    currentTime.getTime() - lastInteractionTime.getTime();
  const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

  const recencyScore = 1 / (diffInHours + 1); // calculate recency score

  return (
    entry.viewsCount * weights.views +
    likesCount * weights.likes +
    repliesCount * weights.replies +
    recencyScore * weights.recency // <-- Add this
  );
}

export async function updateBloomingScoreEntry() {
  const entries = await prisma.review.findMany();

  for (const entry of entries) {
    const bloomingScore = calculateBloomingScore(entry);

    await client.zadd("bloomingEntries", bloomingScore, entry.id);

    console.log(
      `Updated entry ${entry.id} /  with new trending score: ${bloomingScore}`
    );
  }

  console.log("Entry blooming scores updated successfully");
}
