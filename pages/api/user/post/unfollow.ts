import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType, Follows } from "@/types/dbTypes";
import { getUserData } from "@/services/userServices";
import { setCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { unfollowerId, unfollowingId } = req.query;

  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Endpoint supports DELETE only." });

  if (
    !unfollowerId ||
    typeof unfollowerId !== "string" ||
    !unfollowingId ||
    typeof unfollowingId !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Signed in User is required and must be a string." });
  }

  if (unfollowerId === unfollowingId)
    return res.status(400).json({ error: "You cannot unfollow yourself." });

  try {
    let followingData = await getUserData(unfollowingId);

    // Confirm followee has follower as a follower
    const isFollowingAtoB = followingData.followers.some(
      (follower: Follows) => {
        return follower.followerId === String(unfollowerId);
      },
    );

    if (!isFollowingAtoB)
      return res.status(404).json({ error: "Follow relationship not found." });

    const existingActivity = await prisma.activity.findFirst({
      where: { type: ActivityType.FOLLOWED, referenceId: isFollowingAtoB.id },
    });

    // Delete the follow relationship
    if (existingActivity) {
      const aggregationKey = `${existingActivity.type}|${unfollowingId}|${unfollowerId}`;
      await prisma.notification.deleteMany({
        where: {
          aggregation_Key: aggregationKey,
          recipientId: String(unfollowingId),
          activityId: String(existingActivity.id),
        },
      });
      await prisma.activity.delete({ where: { id: existingActivity.id } });
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: String(unfollowerId),
          followingId: String(unfollowingId),
        },
      },
    });

    // Update the cache
    followingData.followers.pop({ followerId: unfollowerId });
    await setCache(`user:${unfollowingId}:data`, followingData, 3600);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    res.status(500).json({ error: "Failed to remove follow relationship." });
  }
}
