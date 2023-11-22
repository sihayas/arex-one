import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { setCache, getCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { id, sessionUserId } = req.query;

  if (!sessionUserId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Get user data
    let userData;
    userData = await getCache(`user:${id}:data`);
    if (!userData) {
      const user = await prisma.user.findUnique({
        where: { id: String(id) },
        include: {
          _count: { select: { record: true, followers: true } },
        },
      });

      if (user) {
        await setCache(`user:${id}:data`, user, 3600);
        userData = user;
      }
    }

    // Get user essentials
    let userEssentials;
    userEssentials = await getCache(`user:${id}:essentials:data`);
    if (!userEssentials) {
      const essentials = await prisma.essential.findMany({
        where: { userId: String(id) },
        include: { album: true },
        orderBy: { rank: "asc" },
      });

      if (essentials) {
        await setCache(`user:${id}:essentials`, essentials, 3600);
        userEssentials = essentials;
      }
    }

    const [followAtoB, followBtoA, uniqueRecords] = await Promise.all([
      prisma.follows.findFirst({
        where: {
          followerId: String(sessionUserId),
          followingId: String(id),
        },
      }),
      prisma.follows.findFirst({
        where: {
          followerId: String(id),
          followingId: String(sessionUserId),
        },
      }),
      prisma.record.groupBy({
        by: ["albumId", "trackId"],
        where: { authorId: String(id), type: "ENTRY" },
        _count: { albumId: true, trackId: true },
      }),
    ]);

    return res.status(200).json({
      ...userData,
      essentials: userEssentials,
      isFollowingAtoB: followAtoB != null,
      isFollowingBtoA: followBtoA != null,
      uniqueRecords: uniqueRecords,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}
