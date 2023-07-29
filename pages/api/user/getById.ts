import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          reviews: {
            include: {
              album: true,
              likes: true,
              replies: true,
            },
          },
          replies: {
            include: {
              likes: true,
            },
          },
          accounts: true,
          sessions: true,
          favorites: {
            include: {
              album: true,
            },
          },
        },
      });

      if (user) {
        const userWithLikes = {
          ...user,
          reviews: user.reviews.map((review) => {
            const likedByUser = review.likes.some(
              (like) => like.authorId === id
            );
            return {
              ...review,
              likedByUser,
            };
          }),
        };

        res.status(200).json(userWithLikes);
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
