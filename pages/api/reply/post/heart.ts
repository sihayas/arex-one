import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";

type Data = {
  success: boolean;
  hearts: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { replyId, action, userId } = req.body;

  if (action === "heart") {
    // Create a new heart
    const newHeart = await prisma.heart.create({
      data: {
        authorId: userId,
        replyId,
      },
    });

    // Fetch the reply to get the author's ID
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { authorId: true },
    });

    // If the author is not the hearter, create an activity and a notification
    if (reply && reply.authorId !== userId) {
      const activity = await prisma.activity.create({
        data: {
          type: ActivityType.HEART,
          id: newHeart.id, // using the ID of the heart
        },
      });

      await prisma.notification.create({
        data: {
          recipientId: reply.authorId,
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
    return res.status(400).json({ success: false, hearts: 0 });
  }

  // Get the updated heart count for the reply
  const updatedHearts = await prisma.heart.count({
    where: { replyId },
  });

  res.status(200).json({ success: true, hearts: updatedHearts });
}
