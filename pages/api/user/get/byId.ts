import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
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
      // Is the signed-in user following the user whose profile they're viewing?
      const followAtoB = await prisma.follows.findFirst({
        where: {
          followerId: String(sessionUserId),
          followingId: String(id),
        },
      });

      // Is the user whose profile is being viewed following the signed-in user?
      const followBtoA = await prisma.follows.findFirst({
        where: {
          followerId: String(id),
          followingId: String(sessionUserId),
        },
      });

      const isFollowingAtoB = followAtoB != null;
      const isFollowingBtoA = followBtoA != null;

      const user = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          essentials: {
            include: {
              album: true,
            },
            orderBy: {
              rank: "asc",
            },
          },
          _count: {
            select: { record: true, followers: true },
          },
          followers: {
            take: 3,
            select: {
              follower: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // Fetch the uniqueAlbums entry count
      const uniqueAlbums = await prisma.record.groupBy({
        by: ["albumId", "trackId"],
        where: { authorId: String(id), type: "ENTRY" },
        _count: {
          albumId: true,
          trackId: true,
        },
      });

      if (user) {
        const userWithHeartsAndFollowStatus = {
          ...user,
          isFollowingAtoB,
          isFollowingBtoA,
          _count: {
            ...user._count,
          },
          uniqueAlbums: uniqueAlbums,
        };

        res.status(200).json(userWithHeartsAndFollowStatus);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
