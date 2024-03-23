import { prisma } from "@/lib/global/prisma";
import { createKey } from "@/pages/api/middleware";

import { ActivityType } from "@/types/dbTypes";

export const runtime = "edge";

export default async function onRequestPost(request: any) {
  try {
    const { authorId, userId } = await request.json();

    if (authorId === userId) {
      throw new Error("You cannot follow yourself.");
    }

    // Check if an active follow relationship already exists
    const existingFollow = await prisma.follows.findFirst({
      where: {
        followerId: authorId,
        followingId: userId,
        isDeleted: false,
      },
    });

    if (existingFollow) {
      throw new Error("Follow relationship already exists.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const newFollow = await tx.follows.create({
        data: { followerId: authorId, followingId: userId },
      });
      // Check if the followee is following the follower
      const inverseFollow = await tx.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: authorId,
          },
          isDeleted: false,
        },
      });
      const followType = inverseFollow
        ? ActivityType.Followed
        : ActivityType.FollowedBack;
      const activity = await tx.activity.create({
        data: {
          type: followType,
          referenceId: newFollow.id,
        },
      });
      await tx.notification.create({
        data: {
          key: createKey(followType, newFollow.id),
          recipientId: userId,
          activityId: activity.id,
        },
      });

      return { success: true, message: "Followed successfully" };
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Follow attempt exited with error:", error);
    return new Response(
      JSON.stringify({ error: "Follow relationship already exists." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
