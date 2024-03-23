import { prisma } from "@/lib/global/prisma";
import { createArtifactActivity } from "@/pages/api/middleware";
import { setCache, redis } from "@/lib/global/redis";
import { ArtifactType, SoundType } from "@prisma/client";

export default async function onRequest(request: any) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { rating, loved, text, userId, sound } = await request.json();
  const appleId = sound.id;
  const type = sound.type;
  const isAlbum = type === "albums";
  const isWisp = rating === 0 || type === "songs";
  const album = type === "songs" ? sound.relationships.albums.data[0] : sound;

  try {
    const existingSound = await prisma.sound.findUnique({
      where: { appleId },
    });

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
            ...(isWisp
              ? {}
              : {
                  ratings_count: 1,
                  ratings_sum: rating,
                }),
          },
        });
      } else {
        await prisma.sound.upsert({
          where: { appleId: album.id },
          update: {
            Songs: {
              create: {
                appleId: sound.id,
                type: SoundType.songs,
                attributes: {
                  create: sound.attributes,
                },
              },
            },
          },
          create: {
            appleId: album.id,
            type: SoundType.albums,
            attributes: {
              create: album.attributes,
            },
            Songs: {
              create: {
                appleId: sound.id,
                type: SoundType.songs,
                attributes: {
                  create: sound.attributes,
                },
              },
            },
          },
        });
        await setCache(
          `sound:songs:${sound.id}:data`,
          JSON.stringify(sound),
          3600,
        );
      }
    } else if (isAlbum && !isWisp) {
      await prisma.sound.update({
        where: { appleId },
        data: {
          ratings_count: existingSound.ratings_count + 1,
          ratings_sum: existingSound.ratings_sum + rating,
        },
      });
    }

    await setCache(`sound:albums:${appleId}:data`, JSON.stringify(album), 3600);

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

      await redis.sadd("averageQueue", JSON.stringify(appleId));
    }

    await createArtifactActivity(artifact.id);

    return new Response(JSON.stringify({ artifact }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return new Response(JSON.stringify({ error: "Failed to create review." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
