import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

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
              // If liked, include the author info & subsequent liked review/reply data
              like: {
                include: {
                  author: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                  review: {
                    include: {
                      album: true,
                    },
                  },
                  reply: {
                    include: {
                      review: {
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
                      name: true,
                      image: true,
                    },
                  },
                  review: {
                    include: {
                      album: true,
                    },
                  },
                  replyTo: {
                    include: {
                      review: {
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
                      name: true,
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
