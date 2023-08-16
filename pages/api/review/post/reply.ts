import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reviewId, replyId, content, userId } = req.body;
  let rootReplyId = req.body.rootReplyId;

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

      // If it's a root reply (no root reply id was passed in query), update its rootReplyId to its own id
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
        rootReplyId = createdReply.id;
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

      // Find the review to get the author's ID
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { authorId: true },
      });

      if (!review) {
        res.status(404).json({ error: "Review not found." });
        return;
      }

      // Create a new activity for the reply
      const activity = await prisma.activity.create({
        data: {
          type: "reply",
          replyId: createdReply.id,
        },
      });

      // Find all distinct authors in the chain including the root reply
      const authorsInChain = await prisma.reply
        .findMany({
          where: {
            OR: [{ id: rootReplyId }, { rootReplyId }],
          },
          select: { authorId: true },
        })
        .then((authors) => authors.map((a) => a.authorId));

      authorsInChain.push(review.authorId);

      // Create notifications for all unique authors except the one who created the new reply
      // Get unique authors
      const uniqueAuthors = Array.from(new Set(authorsInChain));

      await Promise.all(
        uniqueAuthors
          .filter((author) => author !== userId)
          .map((authorId) =>
            prisma.notification.create({
              data: {
                recipientId: authorId,
                activityId: activity.id,
              },
            })
          )
      );

      res.status(200).json(createdReply);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Error adding reply." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
