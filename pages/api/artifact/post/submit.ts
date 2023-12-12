import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createArtifactActivity } from "@/pages/api/middleware/createActivity";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { setCache } from "@/lib/global/redis";
import { ArtifactType, SoundType } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { rating, loved, text, userId, sound } = req.body;
  const appleId = sound.id;
  const type = sound.type;
  const isWisp = rating === 0 || type === "songs";

  try {
    // @ts-ignore
    const existingSound = await prisma.sound.findUnique({
      where: { appleId },
    });
    let newArtifact;
    // sound holds the song

    // Create the sound if it doesn't exist
    if (!existingSound) {
      const fetchedData = await fetchSoundsByType(type, [appleId]);
      const album = fetchedData[0];

      // Initiate the sound in the database
      if (type === "songs") {
        // Create album with song if it doesn't exist or Update
        await prisma.sound.upsert({
          where: { appleId: album.id, type: SoundType.albums },
          update: {
            Songs: {
              create: {
                appleId: sound.id,
                type: SoundType.songs,
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
            type: SoundType.albums,
            rating: 0,
            attributes: {
              create: {
                name: album.attributes.name,
                artistName: album.attributes.artistName,
                releaseDate: album.attributes.releaseDate,
              },
            },
            Songs: {
              create: {
                appleId: sound.id,
                type: SoundType.songs,
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
            type: SoundType.albums,
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
    }

    // If sound exists ->
    // If is wisp (sound is a song/not an album) or rating for an album is 0 ->
    if (isWisp) {
      newArtifact = await prisma.artifact.create({
        data: {
          type: ArtifactType.wisp,
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text } },
        },
      });
    } else {
      newArtifact = await prisma.artifact.create({
        data: {
          type: ArtifactType.entry,
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text, rating, loved, replay: false } },
        },
      });
    }

    await createArtifactActivity(newArtifact.id);

    res.status(201).json({ newArtifact });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
