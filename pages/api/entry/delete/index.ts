import {
  entryDataKey,
  redis,
  userEntriesKey,
  userFeedKey,
  userFollowersKey,
  userProfileKey,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { entryId, userId } = await req.body();

  try {
    // Mark the entry as deleted
    const deletedEntry = await prisma.entry.update({
      where: { id: entryId },
      data: { is_deleted: true },
    });

    if (!deletedEntry) {
      return res.status(404).json({ error: "Unable to delete entry." });
    }

    // update the feed cache of followers
    let followers = [userId];
    const userFollowers: string[] | null = await redis.get(
      userFollowersKey(userId),
    );

    if (userFollowers) {
      followers.push(...userFollowers);
    }

    // if the followers are not cached, fetch them from the database
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

    // for each follower, update their feed.
    const pipeline = redis.pipeline();
    followers.forEach((followerId) => {
      pipeline.zrem(userFeedKey(followerId), entryId);
    });
    // remove entry data
    pipeline.hdel(entryDataKey(entryId));
    // remove entry id in user profile entries
    pipeline.zrem(userEntriesKey(userId), entryId);
    // decrement the user's entries count
    pipeline.hincrby(userProfileKey(userId), "artifacts_count", -1);
    // remove entry ids from sound entries
    //TODO
    pipeline.zrem(userEntriesKey(userId), entryId);

    await pipeline.exec();

    return res.status(200).json({ success: "Entry deleted." });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return res.status(500).json({ error: "Error deleting entry." });
  }
}
