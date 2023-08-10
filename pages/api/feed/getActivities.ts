import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

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
          // Activities where authorId is in following list of signed in user
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
          // include user following likes
          // like: {
          //   include: {
          //     author: true,
          //   },
          // },
          review: {
            select: {
              id: true,
              content: true,
              author: true,
              albumId: true,
              rating: true,
              // check if user has liked
              likes: {
                select: { id: true },
                where: { authorId: userId },
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
          follow: true,
        },
      });

      activities.forEach((activity) => {
        if (activity.review) {
          activity.review.likedByUser = activity.review.likes.length > 0;
        }
      });

      res.status(200).json(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
