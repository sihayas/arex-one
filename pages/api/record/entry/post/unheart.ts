import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recordId, userId, authorId } = req.body;

  // Prevent users from unhearting their own records
  if (authorId === userId) {
    return res.status(400).json({ success: false });
  }

  // Find the existing heart
  const existingHeart = await prisma.heart.findFirst({
    where: { authorId: userId, recordId },
  });

  // If no heart found, return an error
  if (!existingHeart) {
    return res.status(400).json({
      success: false,
      message: "No heart found to unheart",
    });
  }

  // Find the associated activity
  const existingActivity = await prisma.activity.findFirst({
    where: { type: ActivityType.HEART, referenceId: existingHeart.id },
  });

  // If no activity found, return an error
  if (!existingActivity) {
    return res.status(400).json({
      success: false,
      message: "No activity found to unheart",
    });
  }

  // Find the existing notification
  let existingNotification = await prisma.notification.findFirst({
    where: {
      activity: { type: ActivityType.HEART, heart: { recordId } },
      recipientId: authorId,
    },
    include: { activity: { include: { heart: true } } },
  });

  // If a notification is found, update or delete it based on the user count
  if (existingNotification) {
    if (existingNotification.users.length > 1) {
      await prisma.notification.update({
        where: { id: existingNotification.id },
        data: {
          users: {
            set: existingNotification.users.filter((user) => user !== userId),
          },
        },
      });
    } else {
      await prisma.notification.delete({
        where: { id: existingNotification.id },
      });
    }
  }

  // Delete the activity
  await prisma.activity.delete({ where: { id: existingActivity.id } });

  // Delete the heart
  await prisma.heart.delete({ where: { id: existingHeart.id } });

  // Return a success response
  res.status(200).json({ success: true });
}
