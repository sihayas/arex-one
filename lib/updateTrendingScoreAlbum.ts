import client from "./redis";
import { prisma } from "./prisma";
import { AlbumDBData } from "./interfaces";

// Weights for the trending score calculation
const weights = {
  views: 0.4,
  loves: 0.3,
  ratings: 0.3,
};

// Function to calculate the trending score
function calculateTrendingScore(album: AlbumDBData) {
  return (
    album.viewsCount * weights.views +
    album.lovedCount * weights.loves +
    album.ratingsCount * weights.ratings
  );
}

export async function updateTrendingScoreAlbum() {
  const albums = await prisma.album.findMany();

  // Loop over each album and calculate the trending score
  for (const album of albums) {
    const trendingScore = calculateTrendingScore(album);

    // Update the album with the new trending score in Redis
    await client.zadd("trendingAlbums", trendingScore, album.id);

    console.log(
      `Updated album ${album.id} / ${album.name} with new trending score: ${trendingScore}`
    );
  }

  console.log("Album trending scores updated successfully");
}
