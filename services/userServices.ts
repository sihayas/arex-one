import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";

// Fetches and/or caches user data
async function getUserData(userId: string) {
  let userData = await getCache(`user:${userId}:data`);
  if (!userData) {
    userData = await prisma.user
      .findUnique({
        where: { id: String(userId), isDeleted: false, isBanned: false },
        select: {
          _count: { select: { record: true, followedBy: true } },
          essentials: {
            include: { album: { select: { appleId: true } } },
            orderBy: { rank: "desc" },
          },
          followedBy: {
            where: { isDeleted: false },
            select: { followerId: true },
          },
          username: true,
          id: true,
          image: true,
        },
      })
      .then(
        (u) => u && { ...u, followedBy: u.followedBy.map((f) => f.followerId) },
      );

    if (userData) await setCache(`user:${userId}:data`, userData, 3600);
  }

  return userData;
}

export { getUserData };
