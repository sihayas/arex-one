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

  // Exit early if no user ID is provided
  if (!sessionUserId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (req.method === "GET") {
    try {

      // Check user's following status
      const followAtoB = await prisma.follows.findFirst({
        where: {
          followerId: String(sessionUserId),
          followingId: String(id),
        },
      });

      const followBtoA = await prisma.follows.findFirst({
        where: {
          followerId: String(id),
          followingId: String(sessionUserId),
        },
      });

      const isFollowingAtoB = followAtoB != null;
      const isFollowingBtoA = followBtoA != null;

      // Grab distinct sounds from user's reviews sorted by most recent
      const uniqueAlbums = await prisma.review.findMany({
        where: { authorId: String(id) },
        select: { albumId: true},
        orderBy: {
          createdAt: 'desc'
        },
        distinct: ["albumId"],
      });

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
              album: true,
              rating: true,
              // check if user has liked
              likes: {
                select: { id: true },
                where: { authorId: sessionUserId },
              },
            },
          },
          favorites: {
            include: {
              album: true,
            },
          },
          _count: {
            select: { reviews: true, followers: true },
          },
        },
      });

      if (user) {
        const userWithLikesAndFollowStatus = {
          ...user,
          isFollowingAtoB,
          isFollowingBtoA,
          reviews: user.reviews.map((review) => {
            return {
              ...review,
              likedByUser: review.likes.length > 0,
            };
          }),
          uniqueAlbums,
        };

        res.status(200).json(userWithLikesAndFollowStatus);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
