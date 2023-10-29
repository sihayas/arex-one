import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";
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

  // Prevent users from hearting their own records
  if (authorId === userId) {
    return res.status(400).json({ success: false });
  }

  // Check if the user has already hearted the record
  const existingHeart = await prisma.heart.findFirst({
    where: { authorId: userId, recordId },
  });

  // If the record is already hearted by the user, return an error
  if (existingHeart) {
    return res
      .status(400)
      .json({ success: false, message: "Record already hearted by user" });
  }

  // Create a new heart for the record
  const newHeart = await prisma.heart.create({
    data: { authorId: userId, recordId },
  });
  // Create a new activity for the heart
  const activity = await createHeartActivity(newHeart.id);

  // Check if there is an existing notification for the activity
  let existingNotification = await prisma.notification.findFirst({
    where: {
      activity: { type: ActivityType.HEART, heart: { recordId } },
      recipientId: authorId,
    },
    include: { activity: { include: { heart: true } } },
  });

  // If there is an existing notification, update it
  if (existingNotification) {
    await prisma.notification.update({
      where: { id: existingNotification.id },
      data: { users: { push: userId } },
    });
    // If there is no existing notification, create a new one
  } else {
    await prisma.notification.create({
      data: { recipientId: authorId, activityId: activity.id, users: [userId] },
    });
  }

  // Return a success response
  res.status(200).json({ success: true });
}
