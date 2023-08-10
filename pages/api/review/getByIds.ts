import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ids, userId } = req.body;

    try {
      const reviews = await prisma.review.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          album: {
            select: {
              id: true,
              name: true,
              artist: true,
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
        },
      });

      if (reviews) {
        const reviewsWithUserLikes = reviews.map((review) => {
          const likedByUser = review.likes.length > 0;

          return {
            ...review,
            likedByUser,
          };
        });

        res.status(200).json(reviewsWithUserLikes);
      } else {
        console.log("Reviews not found for ids:", ids);
        res.status(404).json({ error: "Reviews not found." });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Error fetching reviews." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
