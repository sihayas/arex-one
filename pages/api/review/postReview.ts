import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      listened,
      rating,
      loved,
      reviewText,
      isReReview,
      authorId,
      albumId,
    } = req.body;

    const album = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    try {
      const actualIsReReview =
        isReReview ||
        (await prisma.review.count({
          where: {
            authorId: authorId,
            albumId: albumId,
          },
        })) > 0;

      const newReview = await prisma.review.create({
        data: {
          listened,
          loved,
          rating,
          content: reviewText,
          replay: actualIsReReview,
          author: { connect: { id: authorId } },
          album: { connect: { id: albumId } },
          permalink: "", // Initially created with empty permalink
        },
      });

      // Update the review with its ID as permalink after creation
      const updatedReview = await prisma.review.update({
        where: { id: newReview.id },
        data: { permalink: `review/${newReview.id}` },
      });

      // If the review marked the album as loved, increment the album's lovedCount
      if (loved) {
        await prisma.album.update({
          where: { id: albumId },
          data: { lastUpdated: new Date(), lovedCount: { increment: 1 } },
        });
      } else {
        await prisma.album.update({
          where: { id: albumId },
          data: { lastUpdated: new Date() },
        });
      }

      res.status(201).json(updatedReview);
    } catch (error) {
      console.error("Failed to create review:", error);
      res.status(500).json({ error: "Failed to create review." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
