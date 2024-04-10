import { getCache, setCache } from "@/lib/global/redis";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

// Caches user data + image for 1 hour
async function fetchOrCacheUser(userId: string) {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const cacheKey = `user:${userId}:data`;
    const imageCacheKey = `user:${userId}:image`;

    let userData = await getCache(cacheKey);
    let userImage = await getCache(imageCacheKey);

    if (!userData) {
      userData = await prisma.user.findUnique({
        where: { id: String(userId), status: "active" },
        select: {
          _count: {
            select: {
              entries: { where: { is_deleted: false } },
              followed_by: { where: { is_deleted: false } },
            },
          },
          essentials: {
            select: {
              id: true,
              rank: true,
              sound: { select: { apple_id: true } },
            },
            orderBy: { rank: "desc" },
          },
          username: true,
          id: true,
          image: !userImage, // Only fetch image if not cached
          bio: true,
        },
      });

      // @ts-ignore
      const { uniqueSounds } = await countUniqueSounds(userId);
      if (userData && uniqueSounds) {
        userData._count = { ...userData._count, uniqueSounds };
        // Cache user image, then pop it from the user data
        if (!userImage) {
          await setCache(imageCacheKey, JSON.stringify(userData.image), 3600);
          userImage = userData.image;
          delete userData.image;
        }
        // Cache user data
        await setCache(cacheKey, JSON.stringify(userData), 3600);
      }
    }

    if (!userImage) {
      const image = await prisma.user
        .findUnique({
          where: { id: userId, status: "active" },
          select: { image: true },
        })
        .then((u) => (u ? u.image : null));

      if (image) {
        await setCache(imageCacheKey, JSON.stringify(userData.image), 3600);
        userImage = image;
      }
    }

    return { ...userData, image: userImage };
  } catch (error) {
    console.error(`Error fetching or caching user data for ${userId}:`, error);
    throw error;
  }
}

// Caches user followers for 1 hour
async function fetchOrCacheUserFollowers(userId: string) {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });
  try {
    const cacheKey = `user:${userId}:followers`;
    let userFollowers = await getCache(cacheKey);

    if (!userFollowers) {
      userFollowers = await prisma.user
        .findUnique({
          where: { id: userId, status: "active" },
          select: {
            followed_by: {
              where: { is_deleted: false },
              select: { follower_id: true },
            },
          },
        })
        .then((u) => (u ? u.followed_by.map((f) => f.follower_id) : null));

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

async function countUniqueSounds(userId: string) {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const [uniqueSoundCount] = await Promise.all([
      prisma.entry.groupBy({
        by: ["sound_id"],
        where: { author_id: userId },
        _count: { sound_id: true },
      }),
    ]);

    return { uniqueSounds: uniqueSoundCount.length };
  } catch (error) {
    console.error(`Error counting unique sounds for ${userId}:`, error);
    throw error;
  }
}

export { fetchOrCacheUser, fetchOrCacheUserFollowers };

export const runtime = "edge";
