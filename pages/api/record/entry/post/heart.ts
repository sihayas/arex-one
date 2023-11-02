import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recordId, userId, authorId } = req.body;

  // Author is the user who created the record
  // User is the user who is hearting the record

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

  const aggregationKey = `HEART|${recordId}|${authorId}`;

  await prisma.notification.create({
    data: {
      recipientId: authorId,
      activityId: activity.id,
      aggregation_Key: aggregationKey,
    },
  });

  // Return a success response
  res.status(200).json({ success: true });
}
