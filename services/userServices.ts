import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";

// Fetches and/or caches user data
async function getUserData(userId: string) {
  let userData = await getCache(`user:${userId}:data`);
  if (!userData) {
    userData = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        _count: { select: { record: true, followedBy: true } },
        essentials: {
          include: {
            album: { select: { appleId: true } },
          },
          orderBy: { rank: "desc" },
        },
        followedBy: true,
        username: true,
        id: true,
        image: true,
      },
    });
    await setCache(`user:${userId}:data`, userData, 3600);
  }
  console.log("user data", userData);
  return userData;
}

export { getUserData };
