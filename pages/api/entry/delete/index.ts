import {
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
        await redis.zrem(userEntriesKey(userId), entryId);
        return res.status(200).json({ success: "Entry deleted." });
      }
      await redis.set(userFollowersKey(userId), JSON.stringify(followers));
    }

    followers.push(userId);

    // Remove the entry from the feed of each follower
    const pipeline = redis.pipeline();
    followers.forEach((followerId) => {
      pipeline.zrem(userFeedKey(followerId), entryId);
    });
    // Remove the entry from the user's entries
    pipeline.zrem(userEntriesKey(userId), entryId);
    // Decrement the user's entries count
    await redis.hincrby(userProfileKey(userId), "artifacts_count", -1);
    await pipeline.exec();

    return res.status(200).json({ success: "Entry deleted." });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return res.status(500).json({ error: "Error deleting entry." });
  }
}
