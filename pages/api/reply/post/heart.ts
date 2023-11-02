import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
};

type Reply = {
  replyId: string;
  authorId: string;
  replyToId: string;
};

async function notifyReplyChain(
  replyId: string,
  userId: string,
  activityId: string
) {
  let currentReply = await prisma.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, replyToId: true },
  });

  while (currentReply) {
    // Extract the author ID and replyTo ID from the current reply
    const { authorId, replyToId } = currentReply;

    // If the user has not been notified yet and the author is not the user
    if (authorId !== userId) {
      const userSettings = await prisma.settings.findUnique({
        where: { userId: authorId },
      });

      if (userSettings?.heartNotifications) {
        const aggregationKey = `HEART|${replyId}|${authorId}`;

        await prisma.notification.create({
          data: {
            recipientId: authorId,
            activityId,
            aggregation_Key: aggregationKey,
          },
        });
      }
    }

    // Set the current reply to the parent if there is one
    currentReply = replyToId
      ? await prisma.reply.findUnique({
          where: { id: replyToId },
          select: { authorId: true, replyToId: true },
        })
      : null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { replyId, userId, authorId } = req.body;

  const newHeart = await prisma.heart.create({
    data: {
      authorId: userId,
      replyId,
    },
  });

  const activity = await createHeartActivity(newHeart.id);

  // Start notifying the reply chain from the hearted reply
  await notifyReplyChain(replyId, userId, activity.id);

  res.status(200).json({ success: true });
}
