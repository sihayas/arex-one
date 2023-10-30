import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";
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

  const notifiedUsers = new Set(); // Keep a record of notified users

  while (currentReply) {
    const { authorId, replyToId } = currentReply;

    if (notifiedUsers.has(authorId)) {
      currentReply = replyToId
        ? await prisma.reply.findUnique({
            where: { id: replyToId },
            select: { authorId: true, replyToId: true },
          })
        : null;
      continue;
    }

    const userSettings = await prisma.settings.findUnique({
      where: { userId: authorId },
    });

    if (userSettings?.heartNotifications) {
      let existingNotification = await prisma.notification.findFirst({
        where: {
          AND: [
            { activity: { type: ActivityType.HEART, heart: { replyId } } },
            { recipientId: authorId },
            {
              activity: {
                updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
              },
            }, // 24 hours
          ],
        },
        include: { activity: { include: { heart: true } } },
      });

      if (existingNotification) {
        await prisma.notification.update({
          where: { id: existingNotification.id },
          data: { users: { push: userId } },
        });
      } else {
        await prisma.notification.create({
          data: {
            recipientId: authorId,
            activityId,
            users: [userId],
          },
        });
      }
      notifiedUsers.add(authorId);
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

  // Start notifying the reply chain from the hearted reply
  await notifyReplyChain(replyId, userId, activity.id);

  res.status(200).json({ success: true });
}
