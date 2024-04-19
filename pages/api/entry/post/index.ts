import {
  entryDataKey,
  redis,
  userEntriesKey,
  userFeedKey,
  userFollowersKey,
  userProfileKey,
} from "@/lib/global/redis";
import { Entry } from "@prisma/client";
import { createResponse } from "@/pages/api/middleware";
import { prisma } from "@/lib/global/prisma";

export default async function onRequestPost(request: any) {
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
            songs: {
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
            songs: {
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
    await redis.zadd(userEntriesKey(userId), {
      score: new Date(entry.created_at).getTime(),
      member: entry.id,
    });

    // Update the feed cache of followers
    const userFollowers = await redis.get(userFollowersKey(userId));
    let followers: string[] | null = userFollowers
      ? //   @ts-ignore
        JSON.parse(userFollowers)
      : null;

    // If the followers are not cached, fetch them from the database
    if (!followers) {
      followers = await prisma.user
        .findUnique({
          where: { id: userId, status: "active" },
          select: {
            followers: {
              where: { is_deleted: false },
              select: { follower_id: true },
            },
          },
        })
        .then((u) => (u ? u.followers.map((f) => f.follower_id) : null));

      // No followers so no feeds to update, update user entries and return
      if (!followers) {
        await redis.zadd(userEntriesKey(userId), {
          score: new Date(entry.created_at).getTime(),
          member: entry.id,
        });

        return createResponse(
          { success: "Entry successfully marked as deleted." },
          200,
        );
      }
      await redis.set(userFollowersKey(userId), JSON.stringify(followers));
    }

    followers.push(userId);

    // For each follower, update their feed cache.
    const pipeline = redis.pipeline();
    for (const followerId of followers) {
      pipeline.zadd(userFeedKey(followerId), {
        score: new Date(entry.created_at).getTime(),
        member: entry.id,
      });
    }
    await pipeline.exec();

    // Cache entry data in hash
    await redis.hset(entryDataKey(entry.id), {
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
      likes_count: 0,
      chains_count: 0,
    });

    // Update user profile entries count
    await redis.hincrby(userProfileKey(userId), "entries_count", 1);
    await prisma.activity.create({
      data: { entry_id: entry.id, author_id: userId },
    });

    return createResponse(
      {
        success: true,
        message: "+ Entry created successfully",
        entryType: entry.type,
        timestamp: entry.created_at,
      },
      201,
    );
  } catch (error) {
    console.error("Failed to create review:", error);
    return createResponse({ error: "Failed to create review." }, 500);
  }
}

export const runtime = "edge";
