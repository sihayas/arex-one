import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { Essential, Follows } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/sounds/get/sound";
import { AlbumData } from "@/types/appleTypes";
import { getUserData } from "@/services/userServices";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { sessionUserId, pageUserId } = req.query;

  if (
    !sessionUserId ||
    typeof sessionUserId !== "string" ||
    !pageUserId ||
    typeof pageUserId !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Signed in User is required and must be a string." });
  }

  try {
    let sessionUserData = await getUserData(sessionUserId);
    let pageUserData = await getUserData(pageUserId);

    // Attach album data to each essential
    if (pageUserData.essentials.length > 0) {
      const albumIds = pageUserData.essentials.map(
        (essential: Essential) => essential.album.appleId,
      );
      const essentialAlbums = await fetchAndCacheSoundsByType(
        albumIds.join(","),
        "albums",
      );
      const albumDataMap: { [key: string]: AlbumData } = essentialAlbums.reduce(
        (map: { [key: string]: AlbumData }, album) => {
          // @ts-ignore
          map[album.id] = album;
          return map;
        },
        {},
      );
      pageUserData.essentials.forEach((essential: Essential) => {
        essential.appleAlbumData = albumDataMap[essential.album.appleId];
      });
    }

    // Counts unique albums and tracks
    const [uniqueAlbumCount, uniqueTrackCount] = await Promise.all([
      prisma.record.groupBy({
        by: ["albumId"],
        where: {
          authorId: String(pageUserId),
          type: "ENTRY",
          albumId: { not: null },
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
          trackId: { not: null },
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
        uniqueAlbums: albumCount + trackCount,
      });
    }

    // Determine follow status
    const isFollowingAtoB = pageUserData.followedBy.some(
      (follower: Follows) => {
        return follower.followerId === String(sessionUserId);
      },
    );

    const isFollowingBtoA = sessionUserData.followedBy.some(
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
