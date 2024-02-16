import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheUser } from "@/pages/api/cache/user";
import { setCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Endpoint supports DELETE only." });

  const { unfollowerId, unfollowingId } = req.query;

  if (typeof unfollowerId !== "string" || typeof unfollowingId !== "string") {
    return res
      .status(400)
      .json({ error: "Both unfollowerId and unfollowingId must be strings." });
  }

  if (unfollowerId === unfollowingId) {
    return res.status(400).json({ error: "You cannot unfollow yourself." });
  }

  try {
    let followingData = await fetchOrCacheUser(unfollowingId);

    // If the user is not following, exit early
    const isFollowingAtoB = followingData.followedBy.includes(unfollowerId);
    if (!isFollowingAtoB)
      return res.status(404).json({ error: "Follow relationship not found." });

    // Double check it already hasn't been deleted and exit early
    const alreadyDeleted = await prisma.follows.findFirst({
      where: {
        followerId: unfollowerId,
        followingId: unfollowingId,
        isDeleted: true,
        activities: {
          some: {
            isDeleted: true,
            notifications: { some: { isDeleted: true } },
          },
        },
      },
      select: {
        id: true,
        activities: {
          select: {
            id: true,
            notifications: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (alreadyDeleted) {
      return res.status(404).json({ error: "Follow relationship deleted." });
    }

    // Continue with deletion
    await prisma.follows.updateMany({
      where: {
        followerId: unfollowerId,
        followingId: unfollowingId,
      },
      data: {
        isDeleted: true,
      },
    });
    await prisma.activity.updateMany({
      where: {
        follow: {
          followerId: unfollowerId,
          followingId: unfollowingId,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    await prisma.notification.updateMany({
      where: {
        activity: {
          follow: {
            followerId: unfollowerId,
            followingId: unfollowingId,
          },
        },
      },
      data: {
        isDeleted: true,
      },
    });

    const updatedFollowingData = {
      ...followingData,
      followedBy: followingData.followedBy.filter(
        (id: string) => id !== unfollowerId,
      ),
    };
    await setCache(`user:${unfollowingId}:data`, updatedFollowingData, 3600);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    res.status(500).json({ error: "Failed to remove follow relationship." });
  }
}
