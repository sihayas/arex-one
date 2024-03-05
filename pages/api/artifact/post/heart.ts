import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";
import { createKey } from "@/pages/api/middleware/createKey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>,
) {
  const { artifactId, userId, authorId } = req.body;

  if (
    authorId === userId ||
    (await prisma.heart.findFirst({ where: { authorId: userId, artifactId } }))
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid heart operation" });
  }

  const newHeart = await prisma.heart.create({
    data: { authorId: userId, artifactId },
  });

  const activity = await createHeartActivity(newHeart.id);

  const key = createKey("heart", artifactId);

  await prisma.notification.create({
    data: {
      recipientId: authorId,
      activityId: activity.id,
      key: key,
    },
  });

  res.status(200).json({ success: true });
}

export const runtime = "edge";
