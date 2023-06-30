import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { permalink } = req.query;

  if (req.method === "GET") {
    try {
      const review = await prisma.review.findUnique({
        where: {
          permalink: String(permalink),
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      });

      if (review) {
        res.status(200).json(review);
      } else {
        console.log("Review not found for permalink:", permalink);
        res.status(404).json({ error: "Review not found." });
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "Error fetching review." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
