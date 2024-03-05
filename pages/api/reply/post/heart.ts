import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";
import { createHeartActivity } from "@/pages/api/middleware/createActivity";
import { createKey } from "@/pages/api/middleware/createKey";

type Data = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { replyId, userId, authorId } = req.body;

  if (
    authorId === userId ||
    (await prisma.heart.findFirst({ where: { authorId: userId, replyId } }))
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid heart operation" });
  }

  const newHeart = await prisma.heart.create({
    data: { authorId: userId, replyId },
  });

  const activity = await createHeartActivity(newHeart.id);

  const key = createKey("heart", replyId);

  await prisma.notification.create({
    data: {
      key: key,
      recipientId: authorId,
      activityId: activity.id,
    },
  });

  res.status(200).json({ success: true, message: "Hearted successfully." });
}

export const runtime = "edge";
