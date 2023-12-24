import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
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
        type: ActivityType.heart,
        referenceId: existingHeart.id,
      },
    });

    if (existingActivity) {
      const key = `heart|${replyId}`;
      // Un-notify users in the reply chain and delete the notification
      await prisma.notification.deleteMany({
        where: {
          key,
          recipientId: authorId,
          activityId: existingActivity.id,
        },
      });

      // Delete the activity
      await prisma.activity.delete({
        where: { id: existingActivity.id },
      });
    }

    // Delete the heart
    await prisma.heart.delete({
      where: { id: existingHeart.id },
    });
  }

  res.status(200).json({ success: true });
}
