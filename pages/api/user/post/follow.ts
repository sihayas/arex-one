import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createFollowActivity } from "@/pages/api/middleware/createActivity";
import { ActivityType } from "@/types/dbTypes";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "This endpoint only supports POST requests." });
  }

  const { followerId, followingId } = req.body;

  try {
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followingId,
          followingId: followerId,
        },
      },
    });

    const follow = await prisma.follows.create({
      data: { followerId, followingId },
    });

    const followType = existingFollow
      ? ActivityType.FOLLOWED_BACK
      : ActivityType.FOLLOWED;

    const activity = await createFollowActivity(follow.id, followType);

    const aggregationKey = `${followType}|${followerId}|${followingId}`;
    await prisma.notification.create({
      data: {
        recipientId: followingId,
        activityId: activity.id,
        aggregation_Key: aggregationKey,
      },
    });

    res.status(200).json(follow);
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    res.status(500).json({ error: "Failed to create follow relationship." });
  }
}
