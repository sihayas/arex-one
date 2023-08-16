import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (req.method === "GET") {
    try {
      const review = await prisma.review.findUnique({
        where: {
          id: String(id),
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
          // Include details of up to 3 replies
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

      if (review) {
        // Check if the review is liked by the current user
        const likedByUser = review.likes.length > 0;

        const reviewWithUserLike = {
          ...review,
          likedByUser,
        };

        res.status(200).json(reviewWithUserLike);
      } else {
        console.log("Review not found for id:", id);
        res.status(404).json({ error: "Review not found." });
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "Error fetching review." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
