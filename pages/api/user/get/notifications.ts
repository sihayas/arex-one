import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { groupBy } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  if (
    !userId ||
    isNaN(page) ||
    page < 1 ||
    isNaN(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return res
      .status(400)
      .json({ error: "Invalid user ID, page number or limit." });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: String(userId), isDeleted: false },
      orderBy: { activity: { createdAt: "desc" } },
      skip: (page - 1) * limit,
      take: limit + 1,
      select: {
        key: true,
        activity: {
          select: {
            id: true,
            type: true,
            createdAt: true,
            // Activity is a Heart
            heart: {
              select: {
                author: {
                  select: {
                    id: true,
                    image: true,
                  },
                },
                // Heart is on a Post
                artifact: {
                  select: {
                    id: true,
                    sound: {
                      select: { id: true, appleId: true },
                    },
                  },
                },
                // Heart is on a Reply
                reply: {
                  select: {
                    // Get the Post that the Reply is on
                    artifact: {
                      select: {
                        id: true,
                        sound: {
                          select: { appleId: true },
                        },
                      },
                    },
                    text: true,
                  },
                },
              },
            },
            // Activity is a Follow
            follow: {
              select: {
                follower: {
                  select: {
                    id: true,
                    image: true,
                  },
                },
              },
            },
            // Activity is a Reply
            reply: {
              select: {
                author: {
                  select: {
                    id: true,
                    image: true,
                  },
                },
                artifact: {
                  select: {
                    id: true,
                    sound: {
                      select: { appleId: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const hasMorePages = notifications.length > limit;
    if (hasMorePages) notifications.pop();

    // Group notifications by aggregation key
    const groupedNotifications = groupBy(notifications, "key");

    // Return the grouped notifications
    return res.status(200).json({
      data: {
        notifications: groupedNotifications,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    // Log the error and send a 500 status code with an error message
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error fetching notifications." });
  }
}
