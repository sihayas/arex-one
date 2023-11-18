import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  const { recordId, userId, authorId } = req.body;

  if (
    authorId === userId ||
    (await prisma.heart.findFirst({ where: { authorId: userId, recordId } }))
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid heart operation" });
  }

  const newHeart = await prisma.heart.create({
    data: { authorId: userId, recordId },
  });
  const activity = await createHeartActivity(newHeart.id);

  await prisma.notification.create({
    data: {
      recipientId: authorId,
      activityId: activity.id,
      aggregation_Key: `HEART|${recordId}|${authorId}`,
    },
  });

  res.status(200).json({ success: true });
}
