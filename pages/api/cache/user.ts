import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";

async function fetchOrCacheUser(userId: string) {
  try {
    const cacheKey = `user:${userId}:data`;
    let userData = await getCache(cacheKey);

    if (!userData) {
      userData = await prisma.user.findUnique({
        where: { id: String(userId), isDeleted: false, isBanned: false },
        select: {
          _count: {
            select: {
              artifact: { where: { isDeleted: false, type: "entry" } },
              followedBy: { where: { isDeleted: false } },
            },
          },
          essentials: {
            select: {
              id: true,
              rank: true,
              sound: { select: { appleId: true } },
            },
            orderBy: { rank: "desc" },
          },
          username: true,
          id: true,
          image: true,
          bio: true,
        },
      });

      const { uniqueSounds } = await countUniqueSounds(userId);
      if (userData && uniqueSounds) {
        userData._count = {
          ...userData._count,
          uniqueSounds,
        };
        await setCache(cacheKey, JSON.stringify(userData), 3600);
      }
    }

    return userData;
  } catch (error) {
    console.error(`Error fetching or caching user data for ${userId}:`, error);
    throw error;
  }
}

async function fetchOrCacheUserFollowers(userId: string) {
  try {
    const cacheKey = `user:${userId}:followers`;
    let userFollowers = await getCache(cacheKey);

    if (!userFollowers) {
      userFollowers = await prisma.user
        .findUnique({
          where: { id: userId, isDeleted: false },
          select: {
            followedBy: {
              where: { isDeleted: false },
              select: { followerId: true },
            },
          },
        })
        .then((u) => (u ? u.followedBy.map((f) => f.followerId) : null));

      if (userFollowers) {
        await setCache(cacheKey, JSON.stringify(userFollowers), 3600);
      }
    }

    return userFollowers;
  } catch (error) {
    console.error(`Error fetching or caching followers for ${userId}:`, error);
    throw error;
  }
}

async function countUniqueSounds(
  userId: string,
): Promise<{ uniqueSounds: number }> {
  const [uniqueSoundCount] = await Promise.all([
    prisma.artifact.groupBy({
      by: ["soundId"],
      where: { authorId: userId },
      _count: { soundId: true },
    }),
  ]);

  return {
    uniqueSounds: uniqueSoundCount.length,
  };
}

export { fetchOrCacheUser, fetchOrCacheUserFollowers };

export const runtime = "edge";
