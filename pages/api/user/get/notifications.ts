import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    // Grab unread notifications
    const unread = await prisma.notification.findMany({
      where: { recipientId: String(userId), isDeleted: false, isRead: false },
      orderBy: { activity: { createdAt: "desc" } },
      select: {
        key: true,
      },
    });

    // Group notifications by aggregation key
    const unreadGrouped = unread.reduce(
      (acc, notification) => {
        if (notification.key) {
          // Initialize the group if it doesn't exist
          if (!acc[notification.key]) {
            acc[notification.key] = { notifications: [], count: 0 };
          }
          // Push the current notification into the group and increment the count
          acc[notification.key].notifications.push(notification);
          acc[notification.key].count += 1;
        }
        return acc;
      },
      {} as Record<string, { notifications: typeof unread; count: number }>,
    );

    for (const key in unreadGrouped) {
      const detailedNotifications = await prisma.notification.findMany({
        where: {
          key: key,
          recipientId: String(userId),
          isDeleted: false,
          isRead: false,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          activity: {
            select: {
              type: true,
              createdAt: true,
              // Activity is a Heart
              heart: {
                select: {
                  author: {
                    select: {
                      id: true,
                      image: true,
                      username: true,
                    },
                  },
                  // Heart is on a Post
                  artifact: {
                    select: {
                      id: true,
                      sound: {
                        select: { appleId: true, type: true },
                      },
                    },
                  },
                  // Heart is on a Reply
                  reply: {
                    select: {
                      id: true,
                      // Get the Post that the Reply is on
                      artifact: {
                        select: {
                          id: true,
                          sound: {
                            select: { appleId: true, type: true },
                          },
                        },
                      },
                      // Get the text of the reply being hearted
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
                      username: true,
                    },
                  },
                },
              },
              // Activity is a Reply
              reply: {
                select: {
                  id: true,
                  text: true,
                  author: {
                    select: {
                      id: true,
                      image: true,
                      username: true,
                    },
                  },
                  // Reply is on a Post
                  artifact: {
                    select: {
                      id: true,
                      sound: {
                        select: { appleId: true, type: true },
                      },
                    },
                  },
                  // Reply is to a Reply
                  replyTo: {
                    select: {
                      // Get the Post that the Reply is on
                      artifact: {
                        select: {
                          id: true,
                          sound: {
                            select: { appleId: true, type: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Attach the detailed notifications to the group
      //@ts-ignore
      unreadGrouped[key].notifications = detailedNotifications;
    }

    return res.status(200).json({
      data: {
        notifications: unreadGrouped,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error fetching notifications." });
  }
}
