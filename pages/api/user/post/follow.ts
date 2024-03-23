import { prisma } from "@/lib/global/prisma";
import { createKey } from "@/pages/api/middleware";

import { ActivityType } from "@prisma/client";
import { fetchOrCacheUserFollowers } from "@/pages/api/cache/user";
import { setCache } from "@/lib/global/redis";

export const runtime = "edge";

export default async function onRequestPost(request: any) {
  try {
    const { userId, pageUserId } = await request.json();

    if (userId === pageUserId) {
      throw new Error("You cannot follow yourself.");
    }

    // Check if author is already following the user in cache.
    const userFollowers = await fetchOrCacheUserFollowers(pageUserId);
    if (userFollowers.includes(userId)) {
      throw new Error("You are already following this user.");
    }

    // Create or update a follow
    const result = await prisma.$transaction(async (tx) => {
      const follow = await tx.follows.upsert({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: pageUserId,
          },
        },
        update: {
          // If the follow relationship exists, update the isDeleted flag.
          isDeleted: false,
        },
        create: {
          // Create a new follow relationship if it doesn't exist
          followerId: userId,
          followingId: pageUserId,
        },
      });

      await tx.activity.upsert({
        where: {
          type_referenceId: {
            type: ActivityType.follow,
            referenceId: follow.id,
          },
        },
        update: {
          isDeleted: false,
        },
        create: {
          type: ActivityType.follow,
          referenceId: follow.id,
        },
      });

      // Not sure how to handle updating the notification

      return { success: true, message: "Followed successfully" };
    });

    // Serialize and update the followers cache of the pageUser
    userFollowers.push(userId);
    await setCache(
      `user:${pageUserId}:followers`,
      JSON.stringify(userFollowers),
      3600,
    );

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
