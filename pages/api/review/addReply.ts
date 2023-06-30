import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reviewId, replyId, content, userId } = req.body;

  if (req.method === "POST") {
    // Check if the user is signed in
    if (!userId) {
      res
        .status(401)
        .json({ error: "You must be signed in to reply to a review." });
      return;
    }

    // Input validation
    if ((!reviewId && !replyId) || !content) {
      res
        .status(400)
        .json({ error: "Review ID or Reply ID and content are required." });
      return;
    }

    try {
      // Add the reply to the database
      const reply = await prisma.reply.create({
        data: {
          author: {
            connect: {
              id: userId,
            },
          },
          parent: reviewId
            ? {
                connect: {
                  id: reviewId,
                },
              }
            : undefined,
          replyTo: replyId
            ? {
                connect: {
                  id: replyId,
                },
              }
            : undefined,
          content,
        },
      });

      res.status(200).json(reply);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Error adding reply." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
