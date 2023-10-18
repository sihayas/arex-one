import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { TrackData } from "@/types/interfaces";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { album, userId } = req.body;

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
      // Create a new view record
      const newView = await prisma.view.create({
        data: {
          viewType: "ALBUM",
          referenceId: album.id,
          userId: userId,
        },
      });

      // If album exists, add view. Otherwise, create it & add view.
      const existingAlbum = await prisma.album.upsert({
        where: {
          appleId: album.id,
        },

        create: {
          appleId: album.id,
          name: album.attributes.name,
          releaseDate: album.attributes.releaseDate,
          artist: album.attributes.artistName,
          tracks: {
            create: album.relationships.tracks.data.map((track: TrackData) => ({
              appleId: track.id,
              name: track.attributes.name,
            })),
          },
        },
        update: {},
      });

      res.status(200).json({ album: existingAlbum, view: newView });
    } catch (error) {
      console.error("Error upserting album:", error);
      res.status(500).json({ error: "Error upserting album." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
