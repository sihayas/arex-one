import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";

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

      // Include the user's own ID to fetch their reviews as well
      followingIds.push(userId);

      // Fetch all activities related to the followed users
      const activities = await prisma.activity.findMany({
        where: {
          // Activities where authorId is in following list of signed in user
          OR: [
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
          review: {
            select: {
              id: true,
              content: true,
              author: true,
              albumId: true,
              trackId: true,
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

      // Attach likedByUser property to each activity
      const activitiesWithUserLike = activities.map((activity) => {
        if (activity.review) {
          return {
            ...activity,
            review: {
              ...activity.review,
              likedByUser: activity.review.likes.length > 0,
            },
          };
        }
        return activity;
      });

      res.status(200).json(activitiesWithUserLike);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
