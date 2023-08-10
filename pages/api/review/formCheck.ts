import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

// This API route checks if a review exists for a given user and album when first loading the review form
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = Array.isArray(req.query.userId)
      ? req.query.userId[0]
      : req.query.userId;
    const albumId = Array.isArray(req.query.albumId)
      ? req.query.albumId[0]
      : req.query.albumId;

    if (!userId || !albumId) {
      res.status(400).json({ error: "userId and albumId are required." });
      return;
    }

    try {
      const userReview = await prisma.review.findFirst({
        where: {
          authorId: userId,
          albumId: albumId,
        },
      });

      if (userReview) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Failed to fetch review:", error);
      res.status(500).json({ error: "Failed to fetch review." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
