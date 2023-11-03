import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (req.method === "GET") {
    try {
      const review = await prisma.record.findUnique({
        where: {
          id: String(id),
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
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
          track: {
            select: {
              id: true,
              name: true,
              album: true,
            },
          },
          // Check if hearted
          hearts: {
            select: { id: true },
            where: { authorId: userId },
          },
          _count: {
            select: { replies: true, hearts: true },
          },
          // Include details of up to 3 replies
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

      if (review) {
        // Check if the review is hearted by the current user
        const heartedByUser = review.hearts.length > 0;

        const reviewWithUserHeart = {
          ...review,
          heartedByUser,
        };

        res.status(200).json(reviewWithUserHeart);
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
