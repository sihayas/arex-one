import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { replyId, action, userId, authorId } = req.body;

  if (action === "heart") {
    // Create a new heart
    const newHeart = await prisma.heart.create({
      data: {
        authorId: userId,
        replyId,
      },
    });
    // If the author is not the hearter, create an activity and a notification
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
        replyId,
      },
    });
  } else {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true });
}
