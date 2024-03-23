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
          _count: { select: { artifact: true, followedBy: true } },
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

      if (userData) {
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

export { fetchOrCacheUser, fetchOrCacheUserFollowers };

export const runtime = "edge";
