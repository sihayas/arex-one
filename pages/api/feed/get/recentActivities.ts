import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    const authUserId =
      typeof req.query.authUserId === "string"
        ? req.query.authUserId
        : undefined;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number." });
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "Invalid limit." });
    }

    const skip = (page - 1) * limit;

    try {
      // Fetch recently interacted with records
      const activities = await prisma.activity.findMany({
        where: {
          OR: [{ type: "HEART" }, { type: "REPLY" }, { type: "RECORD" }],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit + 1,
        include: {
          record: {
            select: {
              id: true,
              type: true,
              author: true,
              album: true,
              track: true,
              createdAt: true,
              entry: true,
              caption: true,
              hearts: {
                where: { authorId: authUserId },
              },
              _count: {
                select: { replies: true, hearts: true },
              },
            },
          },
          follow: true,
          heart: {
            include: {
              author: true,
              record: {
                select: {
                  id: true,
                  type: true,
                  author: true,
                  album: true,
                  track: true,
                  createdAt: true,
                  entry: true,
                  caption: true,
                  hearts: {
                    where: { authorId: userId },
                  },
                  _count: {
                    select: { replies: true, hearts: true },
                  },
                },
              },
            },
          },
          reply: {
            include: {
              author: true,
              record: {
                select: {
                  id: true,
                  type: true,
                  author: true,
                  album: true,
                  track: true,
                  createdAt: true,
                  entry: true,
                  caption: true,
                  hearts: {
                    where: { authorId: userId },
                  },
                  _count: {
                    select: { replies: true, hearts: true },
                  },
                },
              },
            },
          },
        },
      });

      // Pagination logic
      const hasMorePages = activities.length > limit;
      if (hasMorePages) {
        activities.pop();
      }

      // Create a Map to track unique record IDs
      const uniqueRecords = new Map();

      // Filter activities for uniqueness and then map to modify each activity
      const activitiesWithUserHeart = activities
        .filter((activity) => {
          let recordId = null;

          // Determine the record ID based on the activity type
          if (activity.record) {
            recordId = activity.record.id;
          } else if (activity.heart?.record) {
            recordId = activity.heart.record.id;
          } else if (activity.reply?.record) {
            recordId = activity.reply.record.id;
          }

          // Check if this record ID has already been processed
          if (recordId && uniqueRecords.has(recordId)) {
            return false; // Skip this activity
          }

          // Mark this record as processed
          if (recordId) {
            uniqueRecords.set(recordId, true);
          }

          return true; // Include this activity
        })
        .map((activity) => {
          // Clone the activity to avoid direct mutation
          let modifiedActivity = { ...activity };

          // Function to add heartedByUser property
          const addHeartedByUser = (record: any) => ({
            ...record,
            heartedByUser: record.hearts.length > 0,
          });

          // Modify activity based on the type
          if (activity.record) {
            modifiedActivity.record = addHeartedByUser(activity.record);
          }

          if (activity.heart && activity.heart.record) {
            modifiedActivity.heart = {
              ...activity.heart,
              record: addHeartedByUser(activity.heart.record),
            };
          }

          if (activity.reply && activity.reply.record) {
            modifiedActivity.reply = {
              ...activity.reply,
              record: addHeartedByUser(activity.reply.record),
            };
          }

          return modifiedActivity; // Return the modified activity
        });

      res.status(200).json({
        data: {
          activities: activitiesWithUserHeart,
          pagination: {
            nextPage: hasMorePages ? page + 1 : null,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res
        .status(500)
        // @ts-ignore
        .json({ error: `Failed to fetch activities: ${error.message}` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
