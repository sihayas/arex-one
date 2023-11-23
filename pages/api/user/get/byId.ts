import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { setCache, getCache } from "@/lib/global/redis";
import { Essential, Follows } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/sounds/get/sound";
import { AlbumData } from "@/types/appleTypes";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { sessionUserId, pageUserId } = req.query;

  if (!sessionUserId || !pageUserId) {
    return res.status(400).json({ error: "Signed in User is required." });
  }

  try {
    // Get pageUser data
    let userData = await getCache(`user:${pageUserId}:data`);
    if (!userData) {
      const user = await prisma.user.findUnique({
        where: { id: String(pageUserId) },
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

      if (user) {
        userData = user;

        if (userData.essentials.length > 0) {
          const albumIds = userData.essentials.map(
            (essential: Essential) => essential.album.appleId,
          );
          // Fetch album data and cache it
          const essentialAlbums = await fetchAndCacheSoundsByType(
            albumIds.join(","),
            "albums",
          );
          // Create a map for quick lookup
          const albumDataMap: { [key: string]: AlbumData } =
            essentialAlbums.reduce(
              (map: { [key: string]: AlbumData }, album) => {
                map[album.id] = album;
                return map;
              },
              {},
            );
          // Attach album data to each essential
          userData.essentials.forEach((essential: Essential) => {
            essential.appleAlbumData = albumDataMap[essential.album.appleId];
          });
        }

        await setCache(`user:${pageUserId}:data`, user, 3600);
      }
    }

    // Determine follow status
    const isFollowingAtoB = userData.followers.includes(String(sessionUserId));
    const isFollowingBtoA = userData.followers.some(
      (follower: Follows) => follower.id === String(sessionUserId),
    );

    const [uniqueAlbumCount, uniqueTrackCount] = await Promise.all([
      prisma.record.groupBy({
        by: ["albumId"],
        where: {
          authorId: String(pageUserId),
          type: "ENTRY",
          albumId: { not: null }, // only records with an albumId
        },
        _count: {
          albumId: true,
        },
      }),
      prisma.record.groupBy({
        by: ["trackId"],
        where: {
          authorId: String(pageUserId),
          type: "ENTRY",
          trackId: { not: null }, // only records with a trackId
        },
        _count: {
          trackId: true,
        },
      }),
    ]);

    const albumCount = uniqueAlbumCount.length;
    const trackCount = uniqueTrackCount.length;

    return res.status(200).json({
      ...userData,
      isFollowingAtoB,
      isFollowingBtoA,
      uniqueAlbums: albumCount + trackCount,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}
