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

  console.log(
    "recieved request for user",
    pageUserId,
    "from user",
    sessionUserId,
    "at",
    new Date().toISOString(),
    "UTC",
  );

  try {
    // Get sessionUser followers
    let sessionUserData = await getCache(`user:${sessionUserId}:data`);
    if (!sessionUserData) {
      // Fetch user data and update cache
      sessionUserData = await prisma.user.findUnique({
        where: { id: String(sessionUserId) },
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
      await setCache(`user:${sessionUserId}:data`, sessionUserData, 3600);
      console.log("sessionUserData", sessionUserData);
    }

    // Get pageUser data
    let pageUserData = await getCache(`user:${pageUserId}:data`);
    if (!pageUserData) {
      // Fetch user data and update cache
      pageUserData = await prisma.user.findUnique({
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
      await setCache(`user:${pageUserId}:data`, pageUserData, 3600);
    }

    // Populate appleAlbumData for each essential
    if (pageUserData.essentials.length > 0) {
      const albumIds = pageUserData.essentials.map(
        (essential: Essential) => essential.album.appleId,
      );
      // Fetch album data and cache it
      const essentialAlbums = await fetchAndCacheSoundsByType(
        albumIds.join(","),
        "albums",
      );
      // Create a map for quick lookup
      const albumDataMap: { [key: string]: AlbumData } = essentialAlbums.reduce(
        (map: { [key: string]: AlbumData }, album) => {
          map[album.id] = album;
          return map;
        },
        {},
      );
      // Attach album data to each essential
      pageUserData.essentials.forEach((essential: Essential) => {
        essential.appleAlbumData = albumDataMap[essential.album.appleId];
      });
    }

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

    // Exit early if pageUser is sessionUser
    if (pageUserId === sessionUserId) {
      return res.status(200).json({
        ...pageUserData,
        isFollowingAtoB: false,
        isFollowingBtoA: false,
        uniqueAlbums: albumCount + trackCount,
      });
    }

    // Determine follow status
    const isFollowingAtoB = pageUserData.followers.some((follower: Follows) => {
      return follower.followerId === String(sessionUserId);
    });

    const isFollowingBtoA = sessionUserData.followers.some(
      (follower: Follows) => {
        return follower.followerId === String(pageUserId);
      },
    );

    return res.status(200).json({
      ...pageUserData,
      isFollowingAtoB,
      isFollowingBtoA,
      uniqueAlbums: albumCount + trackCount,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}
