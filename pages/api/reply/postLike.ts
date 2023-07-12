import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

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
    await prisma.like.create({
      data: {
        authorId: userId,
        replyId,
      },
    });
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

  // Get the updated like count for the review
  const updatedLikes = await prisma.like.count({
    where: { replyId },
  });

  res.status(200).json({ success: true, likes: updatedLikes });
}
