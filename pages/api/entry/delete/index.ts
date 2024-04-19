import {
  redis,
  userEntriesKey,
  userFeedKey,
  userFollowersKey,
  userProfileKey,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";
import { prisma } from "@/lib/global/prisma";

export default async function onRequestPatch(request: any) {
  const { entryId, userId } = await request.json();

  try {
    // Mark the entry as deleted
    const deletedEntry = await prisma.entry.update({
      where: { id: entryId },
      data: { is_deleted: true },
    });

    if (!deletedEntry) {
      return createResponse({ error: "Unable to delete entry." }, 404);
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

        return createResponse({ success: "Entry deleted." }, 200);
      }
      await redis.set(userFollowersKey(userId), JSON.stringify(followers));
    }

    followers.push(userId);

    const pipeline = redis.pipeline();
    // Remove the entry from the feed of each follower
    followers.forEach((followerId) => {
      pipeline.zrem(userFeedKey(followerId), entryId);
    });
    // Remove the entry from the user's entries
    pipeline.zrem(userEntriesKey(userId), entryId);
    // Decrement the user's entries count
    await redis.hincrby(userProfileKey(userId), "entries_count", -1);
    await pipeline.exec();

    return createResponse({ success: "Entry deleted." }, 200);
  } catch (error) {
    console.error("Failed to delete:", error);
    return createResponse({ error: "Failed to delete:" }, 500);
  }
}

export const runtime = "edge";
