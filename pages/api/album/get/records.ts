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
      ? req.query.soundId.join(",")
      : req.query.soundId;

    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    if (!soundId || !userId) {
      return res
        .status(400)
        .json({ error: "Sound ID and User ID are required." });
    }
    const sort = req.query.sort || "newest";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let orderBy: ReviewOrderByWithRelationInput | undefined;

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "positive":
        orderBy = { rating: "desc" };
        break;
      case "negative":
        orderBy = { rating: "asc" };
        break;
      default:
        orderBy = {};
    }

    try {
      const reviews = await prisma.artifact.findMany({
        where: {
          type: "entry",
          OR: [{ sound: { appleId: soundId } }],
        },
        skip,
        orderBy,
        take: 6,
        include: {
          content: true,
          author: true,
          hearts: {
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

      // Less expensive but more queries, maybe better hearts
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
