import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

const MAX_PAGE_SIZE = 100; // Maximum allowed pageSize

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { reviewId, pageSize = 10, lastId = null, userId } = req.query;

  // Input validation
  if (
    !Number.isInteger(Number(pageSize)) ||
    Number(pageSize) < 1 ||
    Number(pageSize) > MAX_PAGE_SIZE
  ) {
    res.status(400).json({
      error: `Invalid pageSize. Must be an integer between 1 and ${MAX_PAGE_SIZE}`,
    });
    return;
  }

  if (lastId !== null && !Number.isInteger(Number(lastId))) {
    res.status(400).json({ error: "Invalid lastId. Must be an integer" });
    return;
  }

  if (typeof reviewId !== "string") {
    res.status(400).json({ error: "Invalid reviewId. Must be a string." });
    return;
  }

  if (userId !== undefined && typeof userId !== "string") {
    res.status(400).json({ error: "Invalid userId. Must be a string." });
    return;
  }

  if (req.method === "GET") {
    try {
      // Fetch all replies pertaining to the [review] passed in request.
      const replies = await prisma.reply.findMany({
        where: {
          reviewId: String(reviewId),
          replyToId: null,
        },
        take: Number(pageSize),
        cursor: lastId ? { id: String(lastId) } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          likes: {
            select: { id: true },
            where: { authorId: userId },
          },
          // Grab a reply if it exists
          replies: {
            select: {
              author: {
                select: {
                  image: true,
                },
              },
            },
            take: 1,
          },
          content: true,
          _count: {
            select: { replies: true, likes: true },
          },
          reviewId: true,
        },
      });

      if (replies) {
        const promises = replies.map(async (reply: any) => {
          const likedByUser = reply.likes.length > 0;

          return {
            ...reply,
            likedByUser,
          };
        });

        const repliesWithUserLike = await Promise.all(promises);

        res.status(200).json(repliesWithUserLike);
      } else {
        console.log("No replies found for review id:", reviewId);
        res.status(404).json({ error: "No replies found." });
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Error fetching replies." });
    }
  }
}
