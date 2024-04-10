import { redis } from "@/lib/global/redis";
import { Entry, PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { fetchOrCacheUserFollowers } from "@/pages/api/cache/user";

export default async function onRequestPost(request: any) {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  const { rating, loved, text, userId, sound } = await request.json();
  const appleId = sound.id;
  const isAlbum = sound.type === "albums";
  const isWisp = rating === 0 || sound.type === "songs";
  const album =
    sound.type === "songs" ? sound.relationships.albums.data[0] : sound;

  try {
    let soundInDatabase = await prisma.sound.findUnique({
      where: { apple_id: appleId },
    });

    // Create the relationship if the sound doesn't exist
    if (!soundInDatabase) {
      // If it's an album, create the album
      if (isAlbum) {
        soundInDatabase = await prisma.sound.create({
          data: {
            apple_id: album.id,
            type: "albums",
            name: album.attributes.name,
            artist_name: album.attributes.artistName,
            release_date: album.attributes.releaseDate,
            upc: album.attributes.upc,
            ...(!isWisp ? { ratings_count: 1, ratings_sum: rating } : {}),
          },
        });
      } else {
        // If it's a song, create the album and the song
        soundInDatabase = await prisma.sound.upsert({
          where: { apple_id: album.id },
          update: {
            Songs: {
              create: {
                apple_id: sound.id,
                type: "songs",
                name: sound.attributes.name,
                artist_name: sound.attributes.artistName,
                release_date: sound.attributes.releaseDate,
                isrc: sound.attributes.isrc,
              },
            },
          },
          create: {
            apple_id: album.id,
            type: "albums",
            name: album.attributes.name,
            artist_name: album.attributes.artistName,
            release_date: album.attributes.releaseDate,
            upc: album.attributes.upc,
            Songs: {
              create: {
                apple_id: sound.id,
                type: "songs",
                name: sound.attributes.name,
                artist_name: sound.attributes.artistName,
                release_date: sound.attributes.releaseDate,
                isrc: sound.attributes.isrc,
              },
            },
          },
        });
      }
    }

    // Sound exists/created, continue creating the respective entry ->
    let entry: Entry;
    if (!isWisp) {
      entry = await prisma.entry.create({
        data: {
          type: "artifact",
          author: { connect: { id: userId } },
          sound: { connect: { apple_id: appleId } },
          text,
          rating,
          loved,
          replay: false,
        },
      });

      // Update the sound's ratings
      await prisma.sound.update({
        where: { id: soundInDatabase.id },
        data: {
          ratings_count: soundInDatabase.ratings_count + 1,
          ratings_sum: soundInDatabase.ratings_sum + rating,
        },
      });

      // Add sound to average queue in redis
      await redis.sadd("averageQueue", JSON.stringify(appleId));
    } else {
      entry = await prisma.entry.create({
        data: {
          type: "wisp",
          author: { connect: { id: userId } },
          sound: { connect: { apple_id: appleId } },
          text,
        },
      });
    }

    // Cache entry in users profile entries
    const unixTimestamp = Math.floor(Date.now() / 1000);
    await redis.zadd(`user:${userId}:entries`, {
      score: unixTimestamp,
      member: entry.id,
    });

    // Fetch user followers and update their feed
    const followersCache = await fetchOrCacheUserFollowers(userId);
    const followers = [...followersCache, userId];

    // For each user, update their feed cache including self using timestamp
    // as score and entry id as member
    const pipeline = redis.pipeline();
    for (const follower of followers) {
      pipeline.zadd(`user:${follower}:feed`, {
        score: unixTimestamp,
        member: entry.id,
      });
    }
    await pipeline.exec();

    // Cache entry data in hash
    await redis.hset(`entry:${entry.id}:data`, {
      id: entry.id,
      sound_id: soundInDatabase.id,
      type: entry.type,
      author_id: userId,
      text: entry.text,
      // Extra fields for artifacts
      rating: entry.rating,
      loved: entry.loved,
      replay: entry.replay,
      created_at: entry.created_at.toISOString(),
    });

    prisma.activity.create({
      data: { type: "entry", reference_id: entry.id },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "+ Entry created successfully",
        entryType: entry.type,
        timestamp: entry.created_at,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to create review:", error);
    return new Response(JSON.stringify({ error: "Failed to create review." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
