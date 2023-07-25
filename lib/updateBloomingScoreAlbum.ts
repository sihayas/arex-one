import client from "./redis";
import { prisma } from "./prisma";
import { AlbumDBData } from "./interfaces";

const weights = {
  views: 0.2,
  loves: 0.1,
  ratings: 0.1,
  recency: 0.6, // This weight is greater to prioritize recency
};

function calculateRecencyScore(lastInteractionTime: Date) {
  const currentTime = Date.now();
  const diffInHours =
    (currentTime - lastInteractionTime.getTime()) / 1000 / 60 / 60; // difference in hours
  return 1 / (diffInHours + 1); // We add 1 to avoid division by zero. This formula ensures that the more recent the album, the higher the recency score.
}

// Function to calculate the trending score
function calculateBloomingScore(album: AlbumDBData) {
  return (
    album.viewsCount * weights.views +
    album.lovedCount * weights.loves +
    album.ratingsCount * weights.ratings +
    calculateRecencyScore(album.lastUpdated) * weights.recency
  );
}

export async function updateBloomingScoreAlbum() {
  const albums = await prisma.album.findMany();

  // Loop over each album and calculate the trending score
  for (const album of albums) {
    const bloomingScore = calculateBloomingScore(album);

    // Update the album with the new trending score in Redis
    await client.zadd("bloomingAlbums", bloomingScore, album.id);

    console.log(
      `Updated album ${album.id} / ${album.name} with new trending score: ${bloomingScore}`
    );
  }

  console.log("Album trending scores updated successfully");
}
