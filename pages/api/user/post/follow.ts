import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createFollowActivity } from "@/pages/api/middleware/createActivity";
import { ActivityType, Follows } from "@/types/dbTypes";
import { getCache, setCache } from "@/lib/global/redis";

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

  // Get sessionUser followers
  let followerData = await getCache(`user:${followerId}:data`);
  if (!followerData) {
    // Fetch user data and update cache
    followerData = await prisma.user.findUnique({
      where: { id: String(followerId) },
      select: {
        _count: { select: { record: true, followers: true } },
        essentials: {
          include: {
            album: { select: { appleId: true } },
          },
          orderBy: { rank: "desc" },
        },
        followers: { select: { followerId: true } },
        username: true,
        id: true,
        image: true,
      },
    });
    await setCache(`user:${followerId}:data`, followerData, 3600);
  }

  // Get pageUser data
  let followingData = await getCache(`user:${followingId}:data`);
  if (!followingData) {
    // Fetch user data and update cache
    followingData = await prisma.user.findUnique({
      where: { id: String(followingId) },
      select: {
        _count: { select: { record: true, followers: true } },
        essentials: {
          include: {
            album: { select: { appleId: true } },
          },
          orderBy: { rank: "desc" },
        },
        followers: { select: { followerId: true } },
        username: true,
        id: true,
        image: true,
      },
    });
    await setCache(`user:${followingId}:data`, followingData, 3600);
  }

  // Check if follower already has following as a follower
  const isFollowingBtoA = followerData.followers.some((follower: Follows) => {
    return follower.followerId === String(followingId);
  });

  const followType = isFollowingBtoA
    ? ActivityType.FOLLOWED_BACK
    : ActivityType.FOLLOWED;

  try {
    const follow = await prisma.follows.create({
      data: { followerId: followerId, followingId: followingId },
    });
    console.log("created follow relationship", follow);
    const activity = await createFollowActivity(follow.id, followType);
    const aggregationKey = `${followType}|${followerId}|${followingId}`;

    await prisma.notification.create({
      data: {
        recipientId: followingId,
        activityId: activity.id,
        aggregation_Key: aggregationKey,
      },
    });

    // Update the cache
    followingData.followers.push({ followerId: followerId });
    await setCache(`user:${followingId}:data`, followingData, 3600);

    res.status(200).json(follow);
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    res.status(500).json({ error: "Failed to create follow relationship." });
  }
}
