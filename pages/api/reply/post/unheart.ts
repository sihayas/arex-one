import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";

type Data = {
  success: boolean;
};
async function unnotifyReplyChain(
  replyId: string,
  userId: string,
  activityId: string
) {
  // Initial fetch of the reply being unhearted
  let currentReply = await prisma.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, replyToId: true },
  });

  // Set to keep track of already notified users to avoid duplicate notifications
  const notifiedUsers = new Set();

  // Traverse up the reply chain to unnotify users
  while (currentReply) {
    const { authorId, replyToId } = currentReply;

    // Skip if this user has already been unnotified
    if (notifiedUsers.has(authorId)) {
      currentReply = replyToId
        ? await prisma.reply.findUnique({
            where: { id: replyToId },
            select: { authorId: true, replyToId: true },
          })
        : null;
      continue;
    }

    // Fetch the existing notification
    let existingNotification = await prisma.notification.findFirst({
      where: {
        activity: { type: ActivityType.HEART, heart: { replyId } },
        recipientId: authorId,
      },
      include: { activity: { include: { heart: true } } },
    });

    // If a notification exists, update or delete it based on the number of users
    if (existingNotification) {
      if (existingNotification.users.length > 1) {
        // If there are other users, update the users array by removing the unhearting user
        await prisma.notification.update({
          where: { id: existingNotification.id },
          data: {
            users: {
              set: existingNotification.users.filter((user) => user !== userId),
            },
          },
        });
      } else {
        // If no other users, delete the notification
        await prisma.notification.delete({
          where: { id: existingNotification.id },
        });
      }
    }

    // Mark this user as unnotified to avoid duplicate unnotifications
    notifiedUsers.add(authorId);

    // Move up the reply chain for the next iteration
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

  const existingHeart = await prisma.heart.findFirst({
    where: {
      authorId: userId,
      replyId,
    },
  });

  if (existingHeart) {
    const existingActivity = await prisma.activity.findFirst({
      where: {
        type: ActivityType.HEART,
        referenceId: existingHeart.id,
      },
    });

    if (existingActivity) {
      await unnotifyReplyChain(replyId, userId, existingActivity.id);

      // Delete notification first
      await prisma.notification.deleteMany({
        where: { activityId: existingActivity.id },
      });

      // Then delete activity
      await prisma.activity.delete({
        where: { id: existingActivity.id },
      });
    }

    // Finally, delete the heart
    await prisma.heart.delete({
      where: { id: existingHeart.id },
    });
  }

  res.status(200).json({ success: true });
}
