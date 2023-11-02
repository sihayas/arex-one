import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createReplyRecordActivity } from "@/pages/api/middleware/createActivity";

// Function to notify all users in the reply chain
async function notifyReplyChain(
  replyId: string,
  userId: string,
  activityId: string
) {
  const notifiedUsers = new Set();

  let currentReply = await prisma.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, replyToId: true },
  });

  while (currentReply) {
    const { authorId, replyToId } = currentReply;

    if (!notifiedUsers.has(authorId) && authorId !== userId) {
      notifiedUsers.add(authorId);

      const aggregationKey = `REPLY|${replyId}|${authorId}`;

      await prisma.notification.create({
        data: {
          recipientId: authorId,
          activityId: activityId,
          aggregation_Key: aggregationKey,
        },
      });
    }

    currentReply = replyToId
      ? await prisma.reply.findUnique({
          where: { id: replyToId },
          select: { authorId: true, replyToId: true },
        })
      : null;
  }
}
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recordAuthorId, recordId, replyId, content, userId } = req.body;
  let rootReplyId = req.body.rootReplyId;

  // Check if the request method is POST
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
      // Prepare the new reply data
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

      // Notify the record author
      const aggregationKey = `REPLY|${createdReply.id}|${recordAuthorId}`;

      await prisma.notification.create({
        data: {
          recipientId: recordAuthorId,
          activityId: activity.id,
          aggregation_Key: aggregationKey,
        },
      });

      // Notify the reply chain starting from the created reply
      await notifyReplyChain(createdReply.id, userId, activity.id);

      // Send the created reply back in the response
      res.status(200).json(createdReply);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Error adding reply." });
    }
  } else {
    // If the request method is not POST, return an error
    res.status(405).json({ error: "Method not allowed." });
  }
}
