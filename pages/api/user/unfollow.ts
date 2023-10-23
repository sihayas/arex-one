import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";
import { deleteActivity } from "../middleware/createActivity";
import { ActivityType } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { followerId, followingId } = req.query;

  if (req.method === "DELETE") {
    try {
      const follow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: String(followerId),
            followingId: String(followingId),
          },
        },
        include: {
          activities: true,
        },
      });

      if (!follow) {
        return res
          .status(404)
          .json({ error: "Follow relationship not found." });
      }

      // Delete the associated activity
      for (const activity of follow.activities) {
        if (
          activity.type === ActivityType.FOLLOWED ||
          activity.type === ActivityType.FOLLOWED_BACK
        ) {
          await prisma.notification.deleteMany({
            where: {
              activityId: activity.id,
            },
          });
          await deleteActivity(activity.id);
        }
      }

      // Delete the follow relationship
      const unfollow = await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: String(followerId),
            followingId: String(followingId),
          },
        },
      });

      res.status(200).json(unfollow);
    } catch (error) {
      console.error("Error deleting follow relationship:", error);
      res.status(500).json({ error: "Failed to remove follow relationship." });
    }
  } else {
    console.log("Non-DELETE request received.");
    res
      .status(405)
      .json({ error: "This endpoint only supports DELETE requests." });
  }
}
