// Get reviews for an album

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

type SortOrder = "asc" | "desc";

interface ReviewOrderByWithRelationInput {
  rating?: SortOrder;
  createdAt?: SortOrder;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albumId = Array.isArray(req.query.albumId)
    ? req.query.albumId.join(",") // Convert array to string
    : req.query.albumId;

  const page = parseInt(req.query.page as string) || 1;
  const sort = req.query.sort || "newest";
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (!albumId || !userId) {
    return res.status(400).json({ message: "Album ID is required" });
  }

  let orderBy: ReviewOrderByWithRelationInput | undefined;

  switch (sort) {
    case "rating_high_to_low":
      orderBy = { rating: "desc" };
      break;
    case "rating_low_to_high":
      orderBy = { rating: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { albumId },
      skip: (page - 1) * 10,
      take: 10,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        // Check if liked
        likes: {
          select: { id: true },
          where: { authorId: userId },
        },
        _count: {
          select: { replies: true, likes: true },
        },
        replies: {
          take: 3,
          select: {
            author: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const reviewsWithUserLikes = reviews.map((review) => {
      const likedByUser = review.likes.length > 0;

      return {
        ...review,
        likedByUser,
      };
    });

    res.status(200).json(reviewsWithUserLikes);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews." });
  }
}
