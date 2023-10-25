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
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const soundId = Array.isArray(req.query.soundId)
      ? req.query.soundId.join(",")
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
      case "newest": // Switch to Popular
        orderBy = { createdAt: "desc" };
        break;
      case "positive": // Switch to popular with rating > 2.5
        orderBy = { rating: "desc" };
        break;
      case "negative": // Switch to popular with rating < 2.5
        orderBy = { rating: "asc" };
        break;
      default:
        orderBy = {};
    }

    try {
      const reviews = await prisma.record.findMany({
        where: {
          OR: [
            { track: { appleId: soundId } },
            { album: { appleId: soundId } },
          ],
        },
        skip,
        orderBy,
        take: 6,
        include: {
          entry: true,
          author: true,
          // Check if hearted
          hearts: {
            select: { id: true },
            where: { authorId: userId },
          },
          _count: {
            select: { replies: true, hearts: true },
          },
          replies: {
            take: 3,
            select: {
              author: {
                select: {
                  image: true,
                  username: true,
                },
              },
            },
          },
        },
      });

      const reviewsWithUserhearts = reviews.map((review) => {
        const heartedByUser = review.hearts.length > 0;

        return {
          ...review,
          heartedByUser,
        };
      });

      // Less expensive but more queries
      // const reviewsWithUserhearts = await Promise.all(
      //   reviews.map(async (review) => {
      //     const heartCount = await prisma.heart.count({
      //       where: { recordId: review.id, authorId: userId },
      //     });
      //     const heartedByUser = heartCount > 0;

      //     return {
      //       ...review,
      //       heartedByUser,
      //     };
      //   })
      // );

      res.status(200).json(reviewsWithUserhearts);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Error fetching reviews." });
    }
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
