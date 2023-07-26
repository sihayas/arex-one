import { prisma } from "./prisma";
import client from "./redis";
import { ReviewData } from "./interfaces";

// Helper function to calculate the average rating from an array of reviews
function calculateAverageRating(reviews: ReviewData[]) {
  const average =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  return parseFloat(average.toFixed(1));
}

// Helper function to get albums updated within the last few hours
async function getRecentlyUpdatedAlbums(hours: number) {
  const currentDate = new Date();
  const lastRunDate = new Date();
  lastRunDate.setHours(currentDate.getHours() - hours);

  return prisma.album.findMany({
    where: {
      lastUpdated: {
        gte: lastRunDate,
      },
    },
  });
}

export async function updateAlbumRatings() {
  // We assume that this function is run every couple of hours
  const albums = await getRecentlyUpdatedAlbums(2);

  // Loop over each album and calculate the average rating
  for (const album of albums) {
    const reviews: ReviewData[] = await prisma.review.findMany({
      where: { albumId: album.id },
    });

    // Skip albums with no reviews or no new reviews
    if (reviews.length === 0 || reviews.length === album.ratingsCount) continue;

    // Calculate average rating and update the album
    const averageRating = calculateAverageRating(reviews);
    await prisma.album.update({
      where: { id: album.id },
      data: { averageRating, ratingsCount: reviews.length },
    });

    console.log(
      `Updated album ${album.id} with new average rating: ${averageRating}`
    );

    // Save the average rating to the Redis cache
    await client.set(`album:${album.id}:averageRating`, averageRating);
  }

  console.log("Album ratings updated successfully");
}

// In case you reset the database, you can use this function to repopulate
export async function repopulateAllAlbumRatings() {
  // Fetch all albums regardless of lastUpdated date
  const albums = await prisma.album.findMany();

  // Loop over each album and calculate the average rating
  for (const album of albums) {
    const reviews = await prisma.review.findMany({
      where: { albumId: album.id },
    });

    // Skip albums with no reviews
    if (reviews.length === 0) continue;

    // Calculate average rating and update the album
    const averageRating = calculateAverageRating(reviews);
    await prisma.album.update({
      where: { id: album.id },
      data: { averageRating, ratingsCount: reviews.length },
    });

    console.log(
      `Updated album ${album.id} with new average rating: ${averageRating}`
    );

    // Save the average rating to the Redis cache
    await client.set(`album:${album.id}:averageRating`, averageRating);
  }

  console.log("Album ratings updated successfully");
}
