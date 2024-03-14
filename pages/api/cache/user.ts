import { getCache, setCache } from "@/lib/global/redis";
import { prismaClient } from "@/lib/global/prisma";

async function fetchOrCacheUser(userId: string) {
  const prisma = prismaClient();

  try {
    const cacheKey = `user:${userId}:data`;
    let userData = await getCache(cacheKey);

    if (!userData) {
      userData = await prisma.user
        .findUnique({
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
            followedBy: {
              where: { isDeleted: false },
              select: { followerId: true },
            },
            username: true,
            id: true,
            image: true,
            bio: true,
          },
        })
        .then(
          (u) =>
            u && { ...u, followedBy: u.followedBy.map((f) => f.followerId) },
        );

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

export { fetchOrCacheUser };

export const runtime = "edge";
