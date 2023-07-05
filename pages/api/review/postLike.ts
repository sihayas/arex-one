import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getSession } from "next-auth/react";

type Data = {
  success: boolean;
  likes: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { reviewId, action, userId } = req.body;

  if (action === "like") {
    // Create a new like
    await prisma.like.create({
      data: {
        authorId: userId,
        reviewId,
      },
    });
  } else if (action === "unlike") {
    // Remove the existing like
    await prisma.like.deleteMany({
      where: {
        authorId: userId,
        reviewId,
      },
    });
  } else {
    return res.status(400).json({ success: false, likes: 0 });
  }

  // Get the updated like count for the review
  const updatedLikes = await prisma.like.count({
    where: { reviewId },
  });

  res.status(200).json({ success: true, likes: updatedLikes });
}
