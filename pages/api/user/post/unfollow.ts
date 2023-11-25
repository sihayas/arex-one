import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType, Follows } from "@/types/dbTypes";
import { getUserData } from "@/services/userServices";
import { setCache } from "@/lib/global/redis";
import { deleteNotification } from "@/pages/api/middleware/createNotification";
import { deleteActivity } from "@/pages/api/middleware/createActivity";
import { createAggKey } from "@/pages/api/middleware/aggKey";

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
    const isFollowingAtoB = followingData.followedBy.some(
      (follower: Follows) => {
        return follower.followerId === String(unfollowerId);
      },
    );

    if (!isFollowingAtoB)
      return res.status(404).json({ error: "Follow relationship not found." });

    const followsWithActivities = await prisma.follows.findFirst({
      where: {
        followerId: String(unfollowerId),
        followingId: String(unfollowingId),
      },
      include: {
        activities: true,
      },
    });

    // Access the activities
    const existingActivity = followsWithActivities?.activities[0];

    // Delete the follow relationship
    if (existingActivity) {
      const aggKey = createAggKey(
        existingActivity.type,
        String(unfollowingId),
        String(unfollowerId),
      );

      await deleteNotification(
        String(unfollowingId),
        String(existingActivity.id),
        aggKey,
      );

      await deleteActivity(String(existingActivity.id));
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: String(unfollowerId),
          followingId: String(unfollowingId),
        },
      },
    });

    followingData.followedBy.pop({ followerId: unfollowerId });
    followingData.followedByCount -= 1;
    await setCache(`user:${unfollowingId}:data`, followingData, 3600);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    res.status(500).json({ error: "Failed to remove follow relationship." });
  }
}
