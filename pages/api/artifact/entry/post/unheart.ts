import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>,
) {
  const { artifactId, userId, authorId } = req.body;

  if (authorId === userId) {
    return res.status(400).json({ success: false });
  }

  const existingHeart = await prisma.heart.findFirst({
    where: { authorId: userId, artifactId },
  });

  if (!existingHeart) {
    return res
      .status(400)
      .json({ success: false, message: "No heart found to unheart" });
  }

  const existingActivity = await prisma.activity.findFirst({
    where: { type: ActivityType.heart, referenceId: existingHeart.id },
  });

  if (!existingActivity) {
    return res
      .status(400)
      .json({ success: false, message: "No activity found to unheart" });
  }

  const aggregationKey = `heart|${artifactId}|${authorId}`;
  await prisma.$transaction([
    prisma.notification.deleteMany({
      where: {
        aggregation_Key: aggregationKey,
        recipientId: authorId,
        activityId: existingActivity.id,
      },
    }),
    prisma.activity.delete({ where: { id: existingActivity.id } }),
    prisma.heart.delete({ where: { id: existingHeart.id } }),
  ]);

  res.status(200).json({ success: true });
}
