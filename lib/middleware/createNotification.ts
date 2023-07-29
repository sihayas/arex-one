import { prisma } from "../prisma";

export async function createNotificationForFollowers(
  activityId: string,
  userId: string
) {
  // Fetch all the followers of the user
  const followers = await prisma.follows.findMany({
    where: {
      followingId: userId,
    },
  });

  // Create notifications for each follower
  for (const follower of followers) {
    await prisma.notification.create({
      data: {
        recipientId: follower.followerId,
        activityId,
      },
    });
  }
}
