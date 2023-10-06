import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    // Pagination validation
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number." });
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "Invalid limit." });
    }

    const skip = (page - 1) * limit;

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
        skip,
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          // Activities where authorId is in following list of signed-in user
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
              createdAt: true,
              // To grab album data from Apple API
              album: {
                select: {
                  id: true,
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

      const hasMorePages = activities.length > limit;
      if (hasMorePages) {
        activities.pop(); // remove the extra item if there are more pages
      }

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

      console.log({
        hasMorePages,
        page,
        limit,
        activitiesLength: activities.length,
        nextPage: hasMorePages ? page + 1 : null,
      });

      res.status(200).json({
        data: {
          activities: activitiesWithUserLike,
          pagination: {
            nextPage: hasMorePages ? page + 1 : null,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
