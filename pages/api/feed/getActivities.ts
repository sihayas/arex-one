import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      // Fetch all the users the current user is following
      const following = await prisma.follows.findMany({
        where: {
          followerId: userId,
        },
      });

      // Extract the IDs of the followed users
      const followingIds = following.map((f) => f.followingId);

      // Fetch all activities related to the followed users
      const activities = await prisma.activity.findMany({
        where: {
          OR: [
            {
              like: {
                authorId: {
                  in: followingIds,
                },
              },
            },
            {
              review: {
                authorId: {
                  in: followingIds,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          like: {
            include: {
              author: true,
            },
          },
          review: {
            select: {
              id: true,
              content: true,
              author: true,
              albumId: true,
              rating: true,
              likes: true,
              _count: {
                select: { replies: true, likes: true },
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
            },
          },
          follow: true,
        },
      });

      res.status(200).json(activities);

      res.status(200).json(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
