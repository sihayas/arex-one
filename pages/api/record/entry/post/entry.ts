import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createEntryRecordActivity } from "@/pages/api/middleware/createActivity";
import { SongData } from "@/types/appleTypes";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { setCache } from "@/lib/global/redis";

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
      const albumKey = `sound:albums:${albumData.id}:data`;
      const songKey = `sound:songs:${id}:albumId`;

      // Cache  data
      await setCache(albumKey, albumData, 3600);
      await setCache(songKey, albumData.id, 3600);

      // Upsert album with track in database, otherwise add track to album
      await prisma.album.upsert({
        where: { appleId: albumData.id },
        update: {
          tracks: {
            create: {
              appleId: sound.id,
              name: sound.attributes.name,
            },
          },
        },
        create: {
          appleId: albumData.id,
          name: albumData.attributes.name,
          releaseDate: albumData.attributes.releaseDate,
          artist: albumData.attributes.artistName,
          tracks: {
            create: {
              appleId: sound.id,
              name: sound.attributes.name,
            },
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
    } else if (!existingSound && type === "albums") {
      const id = sound.id;
      const fetchedData = await fetchSoundsByType("albums", [id]);
      const albumData = fetchedData[0];
      const albumKey = `sound:albums:${id}:data`;

      // Cache album data
      await setCache(albumKey, albumData, 3600);

      // Upsert album in database
      await prisma.album.upsert({
        where: { appleId: albumData.id },
        update: {},
        create: {
          appleId: albumData.id,
          name: albumData.attributes.name,
          releaseDate: albumData.attributes.releaseDate,
          artist: albumData.attributes.artistName,
        },
      });

      // Set up the record
      const record = await prisma.record.create({
        data: {
          type: "ENTRY",
          author: { connect: { id: userId } },
          album: { connect: { appleId: sound.id } },
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
