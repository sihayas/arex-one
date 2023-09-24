import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

const MAX_PAGE_SIZE = 100; // Maximum allowed pageSize

async function getRootReply(rootReplyId: string, replyToId: string | null) {
  if (rootReplyId !== replyToId && replyToId !== null) {
    const rootReply = await prisma.reply.findUnique({
      where: { id: rootReplyId },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const repliesCount = await prisma.reply.count({
      where: { rootReplyId },
    });

    return { rootReply, repliesCount: repliesCount - 2 };
  }
  return { rootReply: null, repliesCount: null };
}

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
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          likes: true,
          // Count replies and fetch an image for a reply
          replies: {
            include: {
              author: {
                select: {
                  image: true,
                },
              },
            },
            take: 1, // Limit to 3 replies per reply
            select: {
              _count: true,
            },
          },
        },
      });

      if (replies) {
        const promises = replies.map(async (reply: any) => {
          // Here repliesCount is fetched directly from the query
          const repliesCount = reply.replies._count;

          const likedByUser = userId
            ? reply.likes.some((like: any) => {
                return like.authorId === userId;
              })
            : false;

          return {
            ...reply,
            repliesCount,
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
