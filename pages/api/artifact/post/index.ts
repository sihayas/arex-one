import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createArtifactActivity } from "@/pages/api/middleware/createActivity";
import client, { setCache } from "@/lib/global/redis";
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
  const isAlbum = type === "albums";
  const isWisp = rating === 0 || type === "songs";

  // If sound is of type songs, the album is in relationships object
  const album = type === "songs" ? sound.relationships.albums.data[0] : sound;

  try {
    const existingSound = await prisma.sound.findUnique({
      where: { appleId },
    });

    // Create the sound in our DB if it doesn't exist
    if (!existingSound) {
      if (isAlbum) {
        await prisma.sound.create({
          data: {
            appleId: album.id,
            type: SoundType.albums,
            attributes: {
              create: {
                name: album.attributes.name,
                artistName: album.attributes.artistName,
                releaseDate: album.attributes.releaseDate,
              },
            },
            ...(!isWisp && {
              ratings_count: 1,
              ratings_sum: rating,
            }),
          },
        });
      } else {
        // Create album with song if it doesn't exist or Update
        await prisma.sound.upsert({
          where: { appleId: album.id, type: SoundType.albums },
          update: {
            Songs: {
              create: {
                appleId: sound.id,
                type: SoundType.songs,
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
        // Cache song data
        await setCache(`sound:songs:${sound.id}:data`, sound, 3600);
      }
    } else {
      if (isAlbum && !isWisp) {
        await prisma.sound.update({
          where: { appleId },
          data: {
            ratings_count: existingSound.ratings_count + 1,
            ratings_sum: existingSound.ratings_sum + rating,
          },
        });
      }
    }

    await setCache(`sound:albums:${appleId}:data`, album, 3600);

    let artifact;

    // Sound exists/created, continue ->
    if (isWisp) {
      artifact = await prisma.artifact.create({
        data: {
          type: ArtifactType.wisp,
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text } },
        },
      });
    } else {
      artifact = await prisma.artifact.create({
        data: {
          type: ArtifactType.entry,
          author: { connect: { id: userId } },
          sound: { connect: { appleId } },
          content: { create: { text, rating, loved, replay: false } },
        },
      });

      // If album, store in averageQueue8
      await client.sadd("averageQueue", appleId);
    }

    await createArtifactActivity(artifact.id);

    res.status(201).json({ artifact });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
