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
        take: 4, // Fetch at most 4 recent notifications
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
                      // Get the Post that the Reply is on
                      artifact: {
                        select: {
                          id: true,
                          sound: {
                            select: { appleId: true, type: true },
                          },
                        },
                      },
                      text: true,
                      author: {
                        select: {
                          image: true,
                          username: true,
                        },
                      },
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
                  // Reply is on a Reply
                  replyTo: {
                    select: {
                      // Get the Post that the Reply is on
                      // artifact: {
                      //   select: {
                      //     id: true,
                      //     sound: {
                      //       select: { appleId: true, type: true },
                      //     },
                      //   },
                      // },
                      // Get the text of the reply its replying to
                      text: true,
                      author: {
                        select: {
                          image: true,
                          username: true,
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

    // const hasMorePages = notifications.length > limit;
    // if (hasMorePages) notifications.pop();

    // Group notifications by aggregation key
    // const groupedNotifications = groupBy(notifications, "key");

    // Return the grouped notifications
    return res.status(200).json({
      data: {
        notifications: unreadGrouped,
      },
    });
  } catch (error) {
    // Log the error and send a 500 status code with an error message
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error fetching notifications." });
  }
}

// const notifications = await prisma.notification.findMany({
//   where: { recipientId: String(userId), isDeleted: false },
//   orderBy: { activity: { createdAt: "desc" } },
//   skip: (page - 1) * limit,
//   take: limit + 1,
//   select: {
//     key: true,
//     activity: {
//       select: {
//         id: true,
//         type: true,
//         createdAt: true,
//         // Activity is a Heart
//         heart: {
//           select: {
//             author: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//             // Heart is on a Post
//             artifact: {
//               select: {
//                 id: true,
//                 sound: {
//                   select: { id: true, appleId: true },
//                 },
//               },
//             },
//             // Heart is on a Reply
//             reply: {
//               select: {
//                 // Get the Post that the Reply is on
//                 artifact: {
//                   select: {
//                     id: true,
//                     sound: {
//                       select: { appleId: true },
//                     },
//                   },
//                 },
//                 text: true,
//               },
//             },
//           },
//         },
//         // Activity is a Follow
//         follow: {
//           select: {
//             follower: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         // Activity is a Reply
//         reply: {
//           select: {
//             author: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//             artifact: {
//               select: {
//                 id: true,
//                 sound: {
//                   select: { appleId: true },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// });
//
// const notifications = await prisma.notification.groupBy({
//   where: { recipientId: String(userId), isDeleted: false },
//   by: ["key"],
//   _count: true,
//   orderBy: { activity: { createdAt: "desc" } },
//   skip: (page - 1) * limit,
//   take: limit + 1,
//   select: {
//     key: true,
//     activity: {
//       select: {
//         id: true,
//         type: true,
//         createdAt: true,
//         // Activity is a Heart
//         heart: {
//           select: {
//             author: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//             // Heart is on a Post
//             artifact: {
//               select: {
//                 id: true,
//                 sound: {
//                   select: { id: true, appleId: true },
//                 },
//               },
//             },
//             // Heart is on a Reply
//             reply: {
//               select: {
//                 // Get the Post that the Reply is on
//                 artifact: {
//                   select: {
//                     id: true,
//                     sound: {
//                       select: { appleId: true },
//                     },
//                   },
//                 },
//                 text: true,
//               },
//             },
//           },
//         },
//         // Activity is a Follow
//         follow: {
//           select: {
//             follower: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         // Activity is a Reply
//         reply: {
//           select: {
//             author: {
//               select: {
//                 id: true,
//                 image: true,
//               },
//             },
//             artifact: {
//               select: {
//                 id: true,
//                 sound: {
//                   select: { appleId: true },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// });
