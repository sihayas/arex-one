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
    // Extract the parent of the current reply and its author
    const { authorId, replyToId } = currentReply;

    // Skip & change currentReply if this author has already been notified
    if (notifiedUsers.has(authorId)) {
      currentReply = replyToId
        ? await prisma.reply.findUnique({
            where: { id: replyToId },
            select: { authorId: true, replyToId: true },
          })
        : null;
      continue;
    }

    // Check if the author has heart notifications enabled
    const userSettings = await prisma.settings.findUnique({
      where: { userId: authorId },
    });

    if (userSettings?.heartNotifications) {
      // Check if a notification where the activity is a heart towards the reply already exists
      let existingNotification = await prisma.notification.findFirst({
        where: {
          activity: { type: ActivityType.HEART, heart: { replyId } },
          recipientId: authorId,
        },
        include: { activity: { include: { heart: true } } },
      });

      // If it exists, update the users array in the notification
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
      // Mark this user as notified
      notifiedUsers.add(authorId);
    }

    // Move up the reply chain
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
