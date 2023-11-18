import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { id, sessionUserId } = req.query;

  if (!sessionUserId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const [followAtoB, followBtoA, user, uniqueAlbums] = await Promise.all([
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
      prisma.user.findUnique({
        where: { id: String(id) },
        include: {
          essentials: {
            include: { album: true },
            orderBy: { rank: "asc" },
          },
          _count: { select: { record: true, followers: true } },
          followers: {
            take: 3,
            select: { follower: { select: { id: true, image: true } } },
          },
        },
      }),
      prisma.record.groupBy({
        by: ["albumId", "trackId"],
        where: { authorId: String(id), type: "ENTRY" },
        _count: { albumId: true, trackId: true },
      }),
    ]);

    if (user) {
      res.status(200).json({
        ...user,
        isFollowingAtoB: followAtoB != null,
        isFollowingBtoA: followBtoA != null,
        uniqueAlbums: uniqueAlbums,
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}
