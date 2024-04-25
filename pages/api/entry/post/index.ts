import {
  entryDataKey,
  redis,
  soundAppleToDbIdMap,
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
  const { userId, text, rating, replay, loved, sound } = req.body;

  if (!userId || !text || !sound) {
    return res.status(400).json({ error: "missing required fields." });
  }
  const isAlbum = sound.type === "albums";
  const isWisp = rating === 0 || sound.type !== "albums";

  try {
    let soundId = sound.id;

    // no sound id was passed, check if it exists in the database
    if (!soundId) {
      // check map to confirm
      soundId = await redis.hget(soundAppleToDbIdMap(), sound.apple_id);

      // fallback to db, create the hash map of apple id to the db id
      if (!soundId) {
        const soundInDb = await prisma.sound.findFirst({
          where: { apple_id: sound.apple_id },
          select: { id: true },
        });

        if (soundInDb) {
          await redis.hset(soundAppleToDbIdMap(), {
            [sound.apple_id]: soundInDb.id,
          });
          soundId = soundInDb.id;
        }
      }

      // sound does not exist in the database, create it
      if (!soundId) {
        const result = await prisma.sound.create({
          data: {
            apple_id: sound.apple_id,
            name: sound.name,
            artist_name: sound.artist_name,
            release_date: sound.release_date,
            [isAlbum ? "upc" : "isrc"]: sound.identifier,
            type: sound.type,
          },
        });
        await redis.hset(soundAppleToDbIdMap(), {
          [sound.apple_id]: result.id,
        });
        soundId = result.id;
      }
    }

    // sound exists/created, continue creating the respective entry ->
    let entry: Entry;
    if (!isWisp) {
      entry = await prisma.entry.create({
        data: {
          type: "artifact",
          author: { connect: { id: userId } },
          sound: { connect: { id: soundId } },
          text,
          rating,
          loved,
          replay,
        },
      });
      // add album to average queue in redis
      await redis.sadd("averageQueue", soundId);
    } else {
      entry = await prisma.entry.create({
        data: {
          type: "wisp",
          author: { connect: { id: userId } },
          sound: { connect: { id: soundId } },
          text,
        },
      });
    }

    // update the feed cache of followers
    let followers = [userId];
    const userFollowers: string[] | null = await redis.get(
      userFollowersKey(userId),
    );

    if (userFollowers) {
      followers.push(...userFollowers);
    }

    // if the followers are not cached, check the database
    if (!userFollowers?.length) {
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
        followers.push(...dbFollowers);
        await redis.set(userFollowersKey(userId), dbFollowers);
      }
    }

    console.log("userFollowers", followers);

    const unixTime = new Date(entry.created_at).getTime();
    // for each follower, update their feed.
    const pipeline = redis.pipeline();
    followers.forEach((followerId) => {
      pipeline.zadd(userFeedKey(followerId), {
        score: unixTime,
        member: entry.id,
      });
    });
    // cache entry data
    pipeline.hset(
      entryDataKey(entry.id),
      formatEntry({
        id: entry.id,
        sound: { id: soundId, apple_id: sound.apple_id, type: sound.type },
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
    // update user profile entries count
    pipeline.hincrby(userProfileKey(userId), "artifacts_count", 1);
    // cache entry ids in sound entries
    pipeline.zadd(`sound:${soundId}:entry_ids:newest:${rangeRating(rating)}`, {
      score: unixTime,
      member: entry.id,
    });
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
