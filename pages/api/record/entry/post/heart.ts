import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recordId, action, userId, authorId } = req.body;

  if (action === "heart") {
    // Create a new heart
    const newHeart = await prisma.heart.create({
      data: {
        authorId: userId,
        recordId,
      },
    });
    // If the author is not the heartr, create an activity and a notification
    if (authorId !== userId) {
      const activity = await createHeartActivity(newHeart.id);

      await prisma.notification.create({
        data: {
          recipientId: authorId,
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
