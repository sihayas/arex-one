import { prisma } from "@/lib/global/prisma";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Invalid user ID." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const unread = await prisma.notification.findMany({
      where: { recipientId: userId, isDeleted: false, isRead: false },
      orderBy: { activity: { createdAt: "desc" } },
      select: { key: true },
    });

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
        where: { key, recipientId: userId, isDeleted: false, isRead: false },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          isRead: true,
          activity: {
            select: {
              type: true,
              createdAt: true,
              heart: {
                select: {
                  author: { select: { id: true, image: true, username: true } },
                  artifact: {
                    select: {
                      id: true,
                      sound: { select: { appleId: true, type: true } },
                    },
                  },
                  reply: {
                    select: {
                      id: true,
                      artifact: {
                        select: {
                          id: true,
                          sound: { select: { appleId: true, type: true } },
                        },
                      },
                      text: true,
                    },
                  },
                },
              },
              follow: {
                select: {
                  follower: {
                    select: { id: true, image: true, username: true },
                  },
                },
              },
              reply: {
                select: {
                  id: true,
                  text: true,
                  author: { select: { id: true, image: true, username: true } },
                  artifact: {
                    select: {
                      id: true,
                      sound: { select: { appleId: true, type: true } },
                    },
                  },
                  replyTo: {
                    select: {
                      artifact: {
                        select: {
                          id: true,
                          sound: { select: { appleId: true, type: true } },
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
      //@ts-ignore
      unreadGrouped[key].notifications = detailedNotifications;
    }

    return new Response(
      JSON.stringify({ data: { notifications: unreadGrouped } }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching notifications." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
