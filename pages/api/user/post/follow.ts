import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createFollowActivity } from "@/pages/api/middleware/createActivity";
import { createNotification } from "@/pages/api/middleware/createNotification";
import { ActivityType, Follows } from "@/types/dbTypes";
import { setCache } from "@/lib/global/redis";
import { getUserData } from "@/services/userServices";

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

  if (followerId === followingId)
    return res.status(400).json({ error: "You cannot follow yourself." });

  let followerData = await getUserData(followerId);
  let followingData = await getUserData(followingId);

  // Check if follower already has followee as a follower
  const isFollowingBtoA = followerData.followedBy.some((follower: Follows) => {
    return follower.followerId === String(followingId);
  });

  const followType = isFollowingBtoA
    ? ActivityType.FOLLOWED_BACK
    : ActivityType.FOLLOWED;

  try {
    const follow = await prisma.follows.create({
      data: { followerId: followerId, followingId: followingId },
    });

    const activity = await createFollowActivity(follow.id, followType);

    const aggregationKey = `${followType}|${followerId}|${followingId}`;

    await createNotification(followingId, activity.id, aggregationKey);

    // Update the cache
    followingData.followedBy.push({ followerId: followerId });
    followingData._count.followedBy++;
    await setCache(`user:${followingId}:data`, followingData, 3600);

    res.status(200).json(follow);
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    res.status(500).json({ error: "Failed to create follow relationship." });
  }
}
