import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const album = req.body;

  if (req.method === "POST") {
    try {
      const existingAlbum = await prisma.album.upsert({
        where: {
          id: album.id,
        },
        update: {
          viewsCount: {
            increment: 1,
          },
        },
        create: {
          id: album.id,
          name: album.attributes.name,
          releaseDate: album.attributes.releaseDate,
          artist: album.attributes.artistName,
          viewsCount: 1,
        },
      });

      res.status(200).json({ album: existingAlbum });
    } catch (error) {
      console.error("Error upserting album:", error);
      res.status(500).json({ error: "Error upserting album." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
