import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createEntryRecordActivity } from "@/pages/api/middleware/createActivity";
import { SongData } from "@/types/appleTypes";
import { fetchSoundsByType } from "@/lib/global/musicKit";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { rating, loved, text, userId, sound, type } = req.body;
  const appleId = sound.id;
  const dbType = type === "albums" ? "album" : "track";

  try {
    //@ts-ignore
    const existingSound = await prisma[dbType].findUnique({
      where: { appleId },
    });
    // If the sound doesn't exist in the database, populate
    if (!existingSound && type === "songs") {
      const id = sound.id;
      const fetchedData = await fetchSoundsByType("songs", [id]);
      const albumData = fetchedData[0];
      const cacheKey = `sound:albums:${albumData.id}:data`;

      // Create album in database
      await prisma.album.create({
        data: {
          appleId: albumData.id,
          name: albumData.attributes.name,
          releaseDate: albumData.attributes.releaseDate,
          artist: albumData.attributes.artistName,
          tracks: {
            create: albumData.relationships.tracks.data.map(
              (track: SongData) => ({
                appleId: track.id,
                name: track.attributes.name,
              }),
            ),
          },
        },
      });

      // Set up the record
      const record = await prisma.record.create({
        data: {
          type: "ENTRY",
          author: { connect: { id: userId } },
          track: { connect: { appleId: sound.id } },
        },
      });

      // Create entry
      await prisma.entry.create({
        data: {
          text,
          rating,
          loved,
          replay: false,
          recordId: record.id,
        },
      });

      await createEntryRecordActivity(record.id);
    }

    // res.status(201).json({ newRecord, newEntry });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
