import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reviewId, replyId, content, userId, rootReplyId } = req.body;

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
      let newReply = {
        author: {
          connect: {
            id: userId,
          },
        },
        review: {
          connect: {
            id: reviewId,
          },
        },
        replyTo: replyId
          ? {
              connect: {
                id: replyId,
              },
            }
          : undefined,
        content,
      };

      // First create the reply
      const createdReply = await prisma.reply.create({
        data: newReply,
      });

      // If it's a root reply, update its rootReplyId to its own id
      if (!rootReplyId) {
        await prisma.reply.update({
          where: {
            id: createdReply.id,
          },
          data: {
            rootReply: {
              connect: {
                id: createdReply.id,
              },
            },
          },
        });
      } else {
        // If it's not a root reply, set its rootReplyId to the given rootReplyId
        await prisma.reply.update({
          where: {
            id: createdReply.id,
          },
          data: {
            rootReply: {
              connect: {
                id: rootReplyId,
              },
            },
          },
        });
      }

      res.status(200).json(createdReply);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Error adding reply." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
