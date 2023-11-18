import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
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
    const { authorId, replyToId } = currentReply;

    if (authorId !== userId) {
      const userSettings = await prisma.settings.findUnique({
        where: { userId: authorId },
      });

      if (userSettings?.heartNotifications) {
        await prisma.notification.create({
          data: {
            recipientId: authorId,
            activityId,
            aggregation_Key: `HEART|${replyId}|${authorId}`,
          },
        });
      }
    }

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

  await notifyReplyChain(replyId, userId, activity.id);

  res.status(200).json({ success: true });
}
