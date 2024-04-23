import {
  entryDataKey,
  redis,
  userEntriesKey,
  userFeedKey,
  userFollowersKey,
  userProfileKey,
} from "@/lib/global/redis";
import { Entry } from "@prisma/client";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { formatEntry } from "@/lib/helper/cache";

const rangeRating = (rating: number) => {
  return rating <= 2 ? "low" : rating >= 2.5 && rating <= 3.5 ? "mid" : "high";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { rating, loved, text, userId, sound, replay } = req.body;
  const appleId = sound.id;
  const isAlbum = sound.type === "albums";
  const isWisp = rating === 0 || sound.type !== "albums";
  const album =
    sound.type === "songs" ? sound.relationships.albums.data[0] : sound;

  try {
    let soundInDatabase = await prisma.sound.findUnique({
      where: { apple_id: appleId },
    });

    // create the relationship if the sound doesn't exist
    if (!soundInDatabase) {
      // if it's an album, create the album
      if (isAlbum) {
        soundInDatabase = await prisma.sound.create({
          data: {
            apple_id: album.id,
            type: "albums",
            name: album.attributes.name,
            artist_name: album.attributes.artistName,
            release_date: album.attributes.releaseDate,
            upc: album.attributes.upc,
          },
        });
      } else {
        // if it's a song, create the album and the song
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

    // sound exists/created, continue creating the respective entry ->
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
          replay,
        },
      });

      // add sound to average queue in redis
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

    // update the feed cache of followers
    let followers: string[] = (await redis.get(userFollowersKey(userId))) || [];

    // if the followers are not cached, fetch them from the database
    if (!followers.length) {
      const dbFollowers = await prisma.user
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

      if (dbFollowers) {
        // cache the followers
        await redis.set(userFollowersKey(userId), JSON.stringify(followers));
        followers = dbFollowers;
      }
    }

    const unixTime = new Date(entry.created_at).getTime();
    // for each follower, update their feed.
    followers.push(userId);
    const pipeline = redis.pipeline();
    for (const followerId of followers) {
      pipeline.zadd(userFeedKey(followerId), {
        score: unixTime,
        member: entry.id,
      });
    }
    // cache entry data in hash
    pipeline.hset(
      entryDataKey(entry.id),
      formatEntry({
        id: entry.id,
        sound: {
          id: soundInDatabase.id,
          apple_id: soundInDatabase.apple_id,
          type: soundInDatabase.type,
        },
        type: entry.type,
        author_id: userId,
        text: entry.text,
        created_at: entry.created_at,
        _count: { actions: 0, chains: 0 },
        // Extra fields for artifacts
        rating: entry.rating,
        loved: entry.loved,
        replay: entry.replay,
      }),
    );
    // cache entry id in users profile entries
    pipeline.zadd(userEntriesKey(userId), {
      score: unixTime,
      member: entry.id,
    });
    // cache entry ids in sound entries
    pipeline.zadd(
      `sound:${soundInDatabase.id}:entry_ids:newest:${rangeRating(rating)}`,
      { score: unixTime, member: entry.id },
    );
    // update user profile entries count
    pipeline.hincrby(userProfileKey(userId), "artifacts_count", 1);
    await pipeline.exec();

    await prisma.activity.create({
      data: { entry_id: entry.id, author_id: userId },
    });

    return res.status(201).json({
      success: true,
      message: "+ Entry created successfully",
      entryType: entry.type,
      timestamp: entry.created_at,
    });
  } catch (error) {
    console.error("Error creating entry:", error);
    return res.status(500).json({ error: "Error creating entry." });
  }
}
