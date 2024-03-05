import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createFollowActivity } from "@/pages/api/middleware/createActivity";
import { createNotification } from "@/pages/api/middleware/createNotification";
import { ActivityType } from "@/types/dbTypes";
import { setCache } from "@/lib/global/redis";
import { fetchOrCacheUser } from "@/pages/api/cache/user";
import { createKey } from "@/pages/api/middleware/createKey";

async function updateExistingFollow(existingFollow: any) {
  if (!existingFollow) return;

  await prisma.follows.update({
    where: { id: existingFollow.id },
    data: { isDeleted: false },
  });

  const activity = existingFollow.activities[0];
  if (activity) {
    await prisma.activity.update({
      where: { id: activity.id },
      data: { isDeleted: false },
    });

    const notification = activity.notifications[0];
    if (notification) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: { isDeleted: false },
      });
    }
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "This endpoint only supports POST requests." });
  }

  const { followerId, followingId } = req.body;

  if (
    typeof followerId !== "string" ||
    typeof followingId !== "string" ||
    followerId === followingId
  ) {
    return res
      .status(400)
      .json({ error: "Invalid followerId or followingId." });
  }

  try {
    const [followerData, followingData] = await Promise.all([
      fetchOrCacheUser(followerId),
      fetchOrCacheUser(followingId),
    ]);

    // Check if follower is already following
    if (followingData.followedBy.includes(followerId)) {
      return res
        .status(400)
        .json({ error: "You are already following this user." });
    }

    // Check if follow relationship already exists, but is deleted
    const existingFollow = await prisma.follows.findFirst({
      where: {
        followerId,
        followingId,
        isDeleted: true,
        activities: {
          some: {
            isDeleted: true,
            notifications: { some: { isDeleted: true } },
          },
        },
      },
      select: {
        id: true,
        activities: {
          select: {
            id: true,
            notifications: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // Create or update follow relationship
    let follow;
    if (existingFollow) {
      follow = await updateExistingFollow(existingFollow);
    } else {
      const isFollowingBtoA = followerData.followedBy.includes(followingId);
      const followType = isFollowingBtoA
        ? ActivityType.FollowedBack
        : ActivityType.Followed;
      follow = await prisma.follows.create({
        data: { followerId, followingId },
      });
      const activity = await createFollowActivity(follow.id, followType);
      const key = createKey(followType, followingId);
      await createNotification(followingId, activity.id, key);
    }

    // Update following's data in cache
    const updatedFollowingData = {
      ...followingData,
      followedBy: [...followingData.followedBy, followerId],
    };
    await setCache(`user:${followingId}:data`, updatedFollowingData, 3600);

    res.status(200).json(follow);
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    res.status(500).json({ error: "Failed to create follow relationship." });
  }
}

// export const runtime = "edge";
