import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createLikeRecordActivity } from "@/pages/api/middleware/createActivity";

type Data = {
  success: boolean;
  likes: number;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recordId, action, userId } = req.body;

  if (action === "like") {
    // Create a new like
    const newLike = await prisma.like.create({
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

    // If the author is not the liker, create an activity and a notification
    if (record && record.authorId !== userId) {
      const activity = await createLikeRecordActivity(newLike.id);

      await prisma.notification.create({
        data: {
          recipientId: record.authorId,
          activityId: activity.id,
        },
      });
    }
  } else if (action === "unlike") {
    // Remove the existing like
    await prisma.like.deleteMany({
      where: {
        authorId: userId,
        recordId,
      },
    });
  } else {
    return res.status(400).json({ success: false, likes: 0 });
  }

  // Get the updated like count for the review
  const updatedLikes = await prisma.like.count({
    where: { recordId },
  });

  res.status(200).json({ success: true, likes: updatedLikes });
}
