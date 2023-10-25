import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (req.method === "GET") {
    try {
      const notifications = await prisma.notification.findMany({
        where: { recipientId: String(userId) },
        include: {
          activity: {
            include: {
              // If hearted, include the author info & subsequent hearted review/reply data
              heart: {
                include: {
                  author: {
                    select: {
                      username: true,
                      image: true,
                    },
                  },
                  record: {
                    include: {
                      album: true,
                    },
                  },
                  reply: {
                    include: {
                      record: {
                        include: {
                          album: true,
                        },
                      },
                    },
                  },
                },
              },
              // If replied, include the author info & subsequent replied review data. Incude replyTo to indicate reply to reply.
              reply: {
                include: {
                  author: {
                    select: {
                      username: true,
                      image: true,
                    },
                  },
                  record: {
                    include: {
                      album: true,
                    },
                  },
                  replyTo: {
                    include: {
                      record: {
                        include: {
                          album: true,
                        },
                      },
                    },
                  },
                },
              },
              // If followed, include the follower info
              follow: {
                include: {
                  follower: {
                    select: {
                      username: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Error fetching notifications." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
