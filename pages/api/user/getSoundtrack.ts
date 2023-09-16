// getUniqueAlbumsByUserId.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function getUniqueAlbumsByUserId(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, page = 1 } = req.query;

  if (req.method === "GET") {
    try {
      const pageSize = 9;
      const skip = (Number(page) - 1) * pageSize;

      const uniqueAlbums = await prisma.review.findMany({
        where: { authorId: String(userId) },
        select: { albumId: true, rating: true, createdAt: true },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
        distinct: ["albumId"],
      });

      if (uniqueAlbums) {
        res.status(200).json(uniqueAlbums);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching unique albums:", error);
      res.status(500).json({ error: "Error fetching unique albums." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
