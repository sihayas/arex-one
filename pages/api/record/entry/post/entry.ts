import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createArtifactEntryActivity } from "@/pages/api/middleware/createActivity";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { setCache } from "@/lib/global/redis";
import { AlbumData } from "@/types/appleTypes";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { rating, loved, text, userId, sound, type } = req.body;
  const appleId = sound.id;

  try {
    // @ts-ignore
    const existingSound = await prisma.sound.findUnique({
      where: { appleId },
    });
    let newArtifact, newEntry;
    // sound holds the song

    if (!existingSound) {
      const fetchedData = await fetchSoundsByType(type, [appleId]);
      const album = fetchedData[0];

      // If submission is for a SONG
      if (type === "songs") {
        // Create album with song if it doesn't exist or Update
        const created = await prisma.sound.upsert({
          where: { appleId: album.id, type: "albums" },
          update: {
            songs: {
              create: {
                appleId: sound.id,
                type: "songs",
                rating: 0,
                attributes: {
                  create: {
                    name: sound.attributes.albumName,
                    artistName: sound.attributes.artistName,
                    releaseDate: sound.attributes.releaseDate,
                    albumName: sound.attributes.albumName,
                  },
                },
              },
            },
          },
          create: {
            appleId: album.id,
            type: "albums",
            rating: 0,
            attributes: {
              create: {
                name: album.attributes.name,
                artistName: album.attributes.artistName,
                releaseDate: album.attributes.releaseDate,
              },
            },
            songs: {
              create: {
                appleId: sound.id,
                type: "songs",
                rating: 0,
                attributes: {
                  create: {
                    name: sound.attributes.albumName,
                    artistName: sound.attributes.artistName,
                    releaseDate: sound.attributes.releaseDate,
                    albumName: sound.attributes.albumName,
                  },
                },
              },
            },
          },
        });

        // Cache album data and song -> album id
        const albumKey = `sound:albums:${album.id}:data`;
        const songKey = `sound:songs:${appleId}:albumId`;
        const songData = `sound:songs:${sound.id}:data`;

        await setCache(albumKey, album, 3600);
        await setCache(songKey, album.id, 3600);
        await setCache(songData, sound, 3600);
      } else {
        const key = `sound:${type}:${appleId}:data`;
        await setCache(key, album, 3600);
        await prisma.sound.create({
          data: {
            appleId: album.id,
            type: "albums",
            rating: 0,
            attributes: {
              create: {
                name: album.attributes.name,
                artistName: album.attributes.artistName,
                releaseDate: album.attributes.releaseDate,
              },
            },
          },
        });
      }

      newArtifact = await prisma.artifact.create({
        data: {
          type: "entry",
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text, rating, loved, replay: false } },
        },
      });

      await createArtifactEntryActivity(newArtifact.id);
    }
    // If sound exists, check if entry exists
    else {
      newArtifact = await prisma.artifact.create({
        data: {
          type: "entry",
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text, rating, loved, replay: false } },
        },
      });
      await createArtifactEntryActivity(newArtifact.id);
    }

    res.status(201).json({ newRecord, newEntry });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
