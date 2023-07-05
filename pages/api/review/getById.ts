// This API route fetches a review by its ID and includes the author and likes for "Entry.tsx"

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, userId } = req.query;
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const review = await prisma.review.findUnique({
        where: {
          id: String(id),
        },
        include: {
          author: {
            select: {
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
          likes: true,
          replies: {
            select: {
              _count: true,
            },
          },
        },
      });

      if (review) {
        // Check if the review is liked by the current user
        const likedByUser = review.likes.some(
          (like) => like.authorId === userId
        );

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
