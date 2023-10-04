// Get reviews for an album

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

type SortOrder = "asc" | "desc";

interface ReviewOrderByWithRelationInput {
  rating?: SortOrder;
  createdAt?: SortOrder;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const soundId = Array.isArray(req.query.soundId)
      ? req.query.soundId.join(",") // Convert array to string
      : req.query.soundId;

    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    if (!soundId || !userId) {
      return res
        .status(400)
        .json({ error: "Sound ID and User ID are required." });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const sort = req.query.sort || "newest";

    const skip = (page - 1) * limit;

    let orderBy: ReviewOrderByWithRelationInput | undefined;

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      // ... other sort cases
      default:
        orderBy = {};
    }

    try {
      const reviews = await prisma.review.findMany({
        where: {
          OR: [{ trackId: soundId }, { albumId: soundId }],
        },
        skip,
        take: 6,
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
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
