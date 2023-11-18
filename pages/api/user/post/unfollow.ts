import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { followerId, followingId } = req.query;
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Endpoint supports DELETE only." });

  try {
    // Check follow relationship
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: String(followerId),
          followingId: String(followingId),
        },
      },
    });
    if (!existingFollow)
      return res.status(404).json({ error: "Follow relationship not found." });

    // Check associated activity
    const existingActivity = await prisma.activity.findFirst({
      where: { type: ActivityType.FOLLOWED, referenceId: existingFollow.id },
    });
    if (existingActivity) {
      // Delete notification
      const aggregationKey = `${existingActivity.type}|${followingId}|${followerId}`;
      await prisma.notification.deleteMany({
        where: {
          aggregation_Key: aggregationKey,
          recipientId: String(followingId),
          activityId: String(existingActivity.id),
        },
      });
      // Delete activity
      await prisma.activity.delete({ where: { id: existingActivity.id } });
    }

    // Delete follow relationship
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: String(followerId),
          followingId: String(followingId),
        },
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    res.status(500).json({ error: "Failed to remove follow relationship." });
  }
}
