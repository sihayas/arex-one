import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { followerId, followingId } = req.body;

  if (req.method === "POST") {
    try {
      // Check if the "following" user is already following the "follower" user
      const existingFollow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: followingId,
            followingId: followerId,
          },
        },
      });

      const follow = await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });

      // Determine the notification type
      const notificationType = existingFollow ? "followed_back" : "followed";

      const activity = await prisma.activity.create({
        data: {
          type: notificationType,
          followId: follow.id,
        },
      });

      // Create the notification
      await prisma.notification.create({
        data: {
          activityId: activity.id,
          recipientId: followingId,
        },
      });

      res.status(200).json(follow);
    } catch (error) {
      console.error("Error creating follow relationship:", error);
      res.status(500).json({ error: "Failed to create follow relationship." });
    }
  } else {
    res
      .status(405)
      .json({ error: "This endpoint only supports POST requests." });
  }
}
