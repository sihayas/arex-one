import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import slugify from "slugify";

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
      albumName,
    } = req.body;

    const album = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    try {
      const user = await prisma.user.findUnique({ where: { id: authorId } });
      const username = user?.username;

      const previousReviews = await prisma.review.count({
        where: {
          authorId: authorId,
          albumId: albumId,
        },
      });

      const safeUsername = username || "unknown-user";
      const nameSlug = slugify(safeUsername, { lower: true });
      const albumSlug = slugify(albumName, { lower: true });

      const permalink = `${nameSlug}/album/${albumSlug}`;
      const adjustedPermalink =
        previousReviews === 0 ? permalink : `${permalink}/${previousReviews}`;

      const actualIsReReview = isReReview || previousReviews > 0;

      const [newReview] = await prisma.$transaction([
        prisma.review.create({
          data: {
            listened,
            loved,
            rating,
            content: reviewText,
            replay: actualIsReReview,
            author: { connect: { id: authorId } },
            album: { connect: { id: albumId } },
            permalink: adjustedPermalink,
          },
        }),
        prisma.album.update({
          where: { id: albumId },
          data: { lastUpdated: new Date() },
        }),
      ]);

      res.status(201).json(newReview);
    } catch (error) {
      console.error("Failed to create review:", error);
      res.status(500).json({ error: "Failed to create review." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
