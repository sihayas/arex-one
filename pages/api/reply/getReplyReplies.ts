// Fetch replies to a reply by [replyId]

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getSession } from "next-auth/react";

const MAX_PAGE_SIZE = 100; // Maximum allowed pageSize

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { replyId, pageSize = 10, lastId = null } = req.query;
  const session = await getSession({ req });

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
      // Fetch all replies pertaining to the [replyId] passed in request.
      const replies = await prisma.reply.findMany({
        where: {
          replyToId: String(replyId),
        },
        take: Number(pageSize),
        cursor: lastId ? { id: String(lastId) } : undefined,
        orderBy: {
          id: "asc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          likes: true,
          // Count the number of replies for each reply to the reply
          replies: {
            include: {
              author: {
                select: {
                  image: true,
                },
              },
            },
            take: 3, // Limit to 3 replies per reply
            orderBy: {
              id: "asc",
            },
          },
        },
      });

      if (replies) {
        // Add likedByUser field to each reply
        const repliesWithUserLike = replies.map((reply) => ({
          ...reply,
          likedByUser: session
            ? reply.likes.some((like) => like.authorId === session.user.id)
            : false,
        }));

        res.status(200).json(repliesWithUserLike);
      } else {
        console.log("No replies found for reply id:", replyId);
        res.status(404).json({ error: "No replies found." });
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Error fetching replies." });
    }
  }
}
