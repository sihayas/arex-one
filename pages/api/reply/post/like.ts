import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";

type Data = {
  success: boolean;
  likes: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { replyId, action, userId } = req.body;

  if (action === "like") {
    // Create a new like
    const newLike = await prisma.like.create({
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

    // If the author is not the liker, create an activity and a notification
    if (reply && reply.authorId !== userId) {
      const activity = await prisma.activity.create({
        data: {
          type: "like",
          likeId: newLike.id, // using the ID of the like
        },
      });

      await prisma.notification.create({
        data: {
          recipientId: reply.authorId,
          activityId: activity.id,
        },
      });
    }
  } else if (action === "unlike") {
    // Remove the existing like
    await prisma.like.deleteMany({
      where: {
        authorId: userId,
        replyId,
      },
    });
  } else {
    return res.status(400).json({ success: false, likes: 0 });
  }

  // Get the updated like count for the reply
  const updatedLikes = await prisma.like.count({
    where: { replyId },
  });

  res.status(200).json({ success: true, likes: updatedLikes });
}
