import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createReplyRecordActivity } from "@/pages/api/middleware/createActivity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recordAuthorId, recordId, replyId, content, userId } = req.body;
  let rootReplyId = req.body.rootReplyId;

  if (req.method === "POST") {
    // Check if the user is signed in
    if (!userId) {
      res
        .status(401)
        .json({ error: "You must be signed in to reply to a review." });
      return;
    }

    // Check if the review ID or reply ID and content are present
    if ((!recordId && !replyId) || !content) {
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
        record: {
          connect: {
            id: recordId,
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

      // Create a new activity for the reply
      const activity = await createReplyRecordActivity(createdReply.id);

      // Find all distinct authors in the chain including the root reply
      const authorsInChain = await prisma.reply
        .findMany({
          where: {
            OR: [{ id: rootReplyId }, { rootReplyId }],
          },
          select: { authorId: true },
        })
        .then((authors) => authors.map((a) => a.authorId));

      // Add the record author to the list of authors in the chain
      authorsInChain.push(recordAuthorId);

      // Create notifications for all unique authors except the one who created the new reply
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
