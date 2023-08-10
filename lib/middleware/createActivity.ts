import { prisma } from "../global/prisma";

export async function createReviewActivity(reviewId: string) {
  return await prisma.activity.create({
    data: {
      type: "Review",
      reviewId,
    },
  });
}

export async function createLikeActivity(likeId: string) {
  return await prisma.activity.create({
    data: {
      type: "Like",
      likeId,
    },
  });
}
