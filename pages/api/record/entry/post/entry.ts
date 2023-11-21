import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createEntryRecordActivity } from "@/pages/api/middleware/createActivity";
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
    // @ts-ignore
    const existingSound = await prisma[dbType].findUnique({
      where: { appleId },
    });
    let newRecord, newEntry;

    if (!existingSound) {
      const fetchedData = await fetchSoundsByType(type, [appleId]);
      const data = fetchedData[0];

      if (type === "songs") {
        // Cache album data and song -> album id
        const albumKey = `sound:albums:${data.id}:data`;
        const songKey = `sound:songs:${appleId}:albumId`;

        await setCache(albumKey, data, 3600);
        await setCache(songKey, data.id, 3600);

        // Upsert: Create album with song if it doesn't exist, otherwise update
        await prisma.album.upsert({
          where: { appleId: data.id },
          update: {
            tracks: { create: { appleId, name: sound.attributes.name } },
          },
          create: {
            appleId: data.id,
            name: data.attributes.name,
            releaseDate: data.attributes.releaseDate,
            artist: data.attributes.artistName,
            tracks: {
              create: { appleId: sound.id, name: sound.attributes.name },
            },
          },
        });
      } else {
        const key = `sound:${type}:${appleId}:data`;
        await setCache(key, data, 3600);
        await prisma.album.create({
          data: {
            appleId,
            name: data.attributes.name,
            releaseDate: data.attributes.releaseDate,
            artist: data.attributes.artistName,
          },
        });
      }

      newRecord = await prisma.record.create({
        data: {
          type: "ENTRY",
          author: { connect: { id: userId } },
          [dbType]: { connect: { appleId } },
        },
      });

      newEntry = await prisma.entry.create({
        data: {
          text,
          rating,
          loved,
          replay: false,
          recordId: newRecord.id,
        },
      });

      await createEntryRecordActivity(newRecord.id);
    }
    // If sound exists, check if entry exists
    else {
      newRecord = await prisma.record.create({
        data: {
          type: "ENTRY",
          author: { connect: { id: userId } },
          [dbType]: { connect: { appleId } },
        },
      });

      newEntry = await prisma.entry.create({
        data: {
          text,
          rating,
          loved,
          replay: false,
          recordId: newRecord.id,
        },
      });

      await createEntryRecordActivity(newRecord.id);
    }

    res.status(201).json({ newRecord, newEntry });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
