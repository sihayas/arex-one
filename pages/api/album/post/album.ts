import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";
import { TrackData } from "@/lib/global/interfaces";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const album = req.body;

  if (
    !album ||
    !album.relationships ||
    !album.relationships.tracks ||
    !album.relationships.tracks.data
  ) {
    res.status(400).json({ error: "Invalid request payload" });
    return;
  }

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
          tracks: {
            create: album.relationships.tracks.data.map((track: TrackData) => ({
              id: track.id,
              name: track.attributes.name, // Make sure the attribute exists
              duration: track.attributes.durationInMillis, // Make sure the attribute exists
            })),
          },
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
