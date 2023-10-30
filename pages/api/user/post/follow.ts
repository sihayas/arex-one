import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/global/prisma";
import { createFollowActivity } from "../../middleware/createActivity";
import { ActivityType } from "@/types/dbTypes";
import { differenceInHours } from "date-fns"; // Importing date-fns for date calculations

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
    // Check if the followee is alreadying following the follower
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

    // Cross check and determine if the follow is a follow or a follow back
    const followType = existingFollow
      ? ActivityType.FOLLOWED_BACK
      : ActivityType.FOLLOWED;

    const activity = await createFollowActivity(follow.id, followType);

    // Check if there is an existing notification for a follow or follow back activity
    let existingNotification = await prisma.notification.findFirst({
      where: {
        activity: {
          type: followType,
          follow: { followingId, followerId },
        },
        recipientId: followingId,
      },
      include: { activity: true },
      orderBy: {
        activity: { createdAt: "desc" },
      },
    });

    const currentTime = new Date();
    if (existingNotification) {
      // Check the timestamp of the most recent follow activity
      const lastFollowTime = existingNotification.activity.createdAt;
      if (differenceInHours(currentTime, lastFollowTime) > 24) {
        // If more than 24 hours have passed, create a new notification grouping
        existingNotification = null;
      }
    }

    // Create or update notification based on existingNotification
    if (existingNotification) {
      await prisma.notification.update({
        where: { id: existingNotification.id },
        data: { users: { push: followerId } },
      });
    } else {
      await prisma.notification.create({
        data: {
          recipientId: followingId,
          activityId: activity.id,
          users: [followerId],
        },
      });
    }

    res.status(200).json(follow);
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    res.status(500).json({ error: "Failed to create follow relationship." });
  }
}
