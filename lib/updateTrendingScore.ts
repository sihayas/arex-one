import client from "../lib/redis";
import { prisma } from "../lib/prisma";
import { AlbumDBData } from "./interfaces";

// Weights for the trending score calculation
const weights = {
  views: 0.4,
  likes: 0.3,
  ratings: 0.3,
};

// Function to calculate the trending score
function calculateTrendingScore(album: AlbumDBData) {
  return (
    album.viewsCount * weights.views +
    album.likesCount * weights.likes +
    album.ratingsCount * weights.ratings
  );
}

export async function updateTrendingScores() {
  const albums = await prisma.album.findMany();

  // Loop over each album and calculate the trending score
  for (const album of albums) {
    const trendingScore = calculateTrendingScore(album);

    // Update the album with the new trending score in Redis
    await client.set(`album:${album.id}:trendingScore`, trendingScore);

    console.log(
      `Updated album ${album.id} with new trending score: ${trendingScore}`
    );
  }

  console.log("Album trending scores updated successfully");
}
