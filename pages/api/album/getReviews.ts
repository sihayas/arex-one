import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getSession } from "next-auth/react";

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
  const session = await getSession({ req });

  if (!albumId) {
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
            email: true,
            image: true,
          },
        },
        replies: {
          select: {
            _count: true,
          },
        },
        likes: true,
      },
    });

    const reviewsWithUserLikes = reviews.map((review) => {
      const likedByUser = session
        ? review.likes.some((like) => like.authorId === session.user.id)
        : false;

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
