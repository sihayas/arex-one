import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartRecordActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recordId, action, userId } = req.body;

  if (action === "heart") {
    // Create a new heart
    const newHeart = await prisma.heart.create({
      data: {
        authorId: userId,
        recordId,
      },
    });

    // Fetch the review to get the author's ID
    const record = await prisma.record.findUnique({
      where: { id: recordId },
      select: { authorId: true },
    });

    // If the author is not the heartr, create an activity and a notification
    if (record && record.authorId !== userId) {
      const activity = await createHeartRecordActivity(newHeart.id);

      await prisma.notification.create({
        data: {
          recipientId: record.authorId,
          activityId: activity.id,
        },
      });
    }
  } else if (action === "unheart") {
    // Remove the existing heart
    await prisma.heart.deleteMany({
      where: {
        authorId: userId,
        recordId,
      },
    });
  } else {
    return res.status(400).json({ success: false });
  }

  // Get the updated heart count for the review
  const updatedhearts = await prisma.heart.count({
    where: { recordId },
  });

  res.status(200).json({ success: true });
}
