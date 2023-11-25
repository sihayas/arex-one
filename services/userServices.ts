import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";

// Fetches and/or caches user data
async function getUserData(userId: string) {
  let userData = await getCache(`user:${userId}:data`);
  if (!userData) {
    userData = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        _count: { select: { record: true, followers: true } },
        essentials: {
          include: {
            album: { select: { appleId: true } },
          },
          orderBy: { rank: "desc" },
        },
        followers: { select: { followerId: true } },
        username: true,
        id: true,
        image: true,
      },
    });
    await setCache(`user:${userId}:data`, userData, 3600);
  }
  return userData;
}

export { getUserData };
