import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const sessionUserId =
    typeof req.query.sessionUserId === "string"
      ? req.query.sessionUserId
      : undefined;

  if (!sessionUserId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          reviews: {
            select: {
              id: true,
              content: true,
              author: true,
              albumId: true,
              rating: true,
              // check if user has liked
              likes: {
                select: { id: true },
                where: { authorId: sessionUserId },
              },
              // include 2 reply images
              replies: {
                take: 2,
                select: {
                  author: {
                    select: {
                      image: true,
                      name: true,
                    },
                  },
                },
              },
              _count: {
                select: { replies: true, likes: true },
              },
            },
          },
          favorites: {
            include: {
              album: true,
            },
          },
          // Include 3 followers and their images
          followers: {
            take: 3,
            select: {
              follower: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (user) {
        const userWithLikes = {
          ...user,
          reviews: user.reviews.map((review) => {
            return {
              ...review,
              likedByUser: review.likes.length > 0,
            };
          }),
        };

        res.status(200).json(userWithLikes);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
