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

  if (authorId === userId) {
    return res.status(400).json({ success: false });
  }

  const existingHeart = await prisma.heart.findFirst({
    where: { authorId: userId, recordId },
  });

  if (!existingHeart) {
    return res.status(400).json({
      success: false,
      message: "No heart found to unheart",
    });
  }

  const existingActivity = await prisma.activity.findFirst({
    where: { type: ActivityType.HEART, referenceId: existingHeart.id },
  });

  if (!existingActivity) {
    return res.status(400).json({
      success: false,
      message: "No activity found to unheart",
    });
  }

  // Delete notification first
  const aggregationKey = `HEART|${recordId}|${authorId}`;
  await prisma.notification.deleteMany({
    where: {
      aggregation_Key: aggregationKey,
      recipientId: authorId,
      activityId: existingActivity.id,
    },
  });

  // Delete activity second
  await prisma.activity.delete({
    where: { id: existingActivity.id },
  });

  // Delete heart last
  await prisma.heart.delete({
    where: { id: existingHeart.id },
  });

  res.status(200).json({ success: true });
}
