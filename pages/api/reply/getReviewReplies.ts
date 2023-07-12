//Fetches all replies for a review with the given id

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const MAX_PAGE_SIZE = 100; // Maximum allowed pageSize

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, pageSize = 10, lastId = null, userId } = req.query;

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
          parentId: String(id),
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
          // Count the number of replies for each reply to the review
          replies: {
            select: {
              _count: true,
            },
          },
        },
      });

      if (replies) {
        // Add likedByUser field to each reply
        const repliesWithUserLike = replies.map((reply) => {
          console.log("Reply:", reply);
          console.log("Likes:", reply.likes);
          const likedByUser = userId
            ? reply.likes.some((like) => {
                console.log("Comparing:", like.authorId, userId);
                return like.authorId === userId;
              })
            : false;

          console.log("Liked by user:", likedByUser);

          return {
            ...reply,
            likedByUser,
          };
        });

        res.status(200).json(repliesWithUserLike);
      } else {
        console.log("No replies found for review id:", id);
        res.status(404).json({ error: "No replies found." });
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Error fetching replies." });
    }
  }
}
