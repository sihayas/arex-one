import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";
import { createReviewActivity } from "@/lib/middleware/createActivity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { rating, loved, content, replay, userId, albumId, trackId } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let reviewData: any = {
        loved,
        rating,
        content,
        replay,
        author: { connect: { id: userId } },
        permalink: "",
      };

      if (albumId) {
        reviewData.album = { connect: { id: albumId } };
      }

      if (trackId) {
        reviewData.track = { connect: { id: trackId } }; // Assuming you have a song relationship in your schema
      }

      const newReview = await prisma.review.create({
        data: reviewData,
      });

      // Update the review with its ID as permalink
      const updatedReview = await prisma.review.update({
        where: { id: newReview.id },
        data: { permalink: `review/${newReview.id}` },
      });

      if (albumId) {
        // Increment the album's lovedCount and reviewsCount
        await prisma.album.update({
          where: { id: albumId },
          data: {
            lastUpdated: new Date(),
            lovedCount: loved ? { increment: 1 } : undefined,
            reviewsCount: { increment: 1 },
          },
        });
      }

      // Additional logic for song updates can be added here

      return updatedReview;
    });

    // Feed the review into the activity pipeline
    try {
      await createReviewActivity(result.id);
    } catch (error) {
      console.error("Failed to create activity:", error);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
