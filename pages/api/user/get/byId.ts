import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/sounds/get/sound";
import { AlbumData } from "@/types/appleTypes";
import { getUserData } from "@/services/userServices";

async function attachAlbumData(
  essentials: Essential[],
  albumIds: string[],
): Promise<Essential[]> {
  const albumData = await fetchAndCacheSoundsByType(
    albumIds.join(","),
    "albums",
  );
  const albumDataMap = albumData.reduce(
    (map: { [key: string]: AlbumData }, album) => {
      // @ts-ignore
      map[album.id] = album;
      return map;
    },
    {},
  );

  return essentials.map((essential) => ({
    ...essential,
    appleAlbumData: albumDataMap[essential.album.appleId],
  }));
}

async function countUniqueAlbumsAndTracks(
  userId: string,
): Promise<{ albumCount: number; trackCount: number }> {
  const [uniqueAlbumCount, uniqueTrackCount] = await Promise.all([
    prisma.record.groupBy({
      by: ["albumId"],
      where: { authorId: userId, type: "ENTRY", albumId: { not: null } },
      _count: { albumId: true },
    }),
    prisma.record.groupBy({
      by: ["trackId"],
      where: { authorId: userId, type: "ENTRY", trackId: { not: null } },
      _count: { trackId: true },
    }),
  ]);

  return {
    albumCount: uniqueAlbumCount.length,
    trackCount: uniqueTrackCount.length,
  };
}

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

    // Attach album data to essentials
    if (pageUserData.essentials.length > 0) {
      const albumIds = pageUserData.essentials.map(
        (essential: Essential) => essential.album.appleId,
      );
      pageUserData.essentials = await attachAlbumData(
        pageUserData.essentials,
        albumIds,
      );
    }

    const { albumCount, trackCount } =
      await countUniqueAlbumsAndTracks(pageUserId);

    const isFollowingAtoB = pageUserData.followedBy.includes(sessionUserId);
    const isFollowingBtoA = sessionUserData.followedBy.includes(pageUserId);

    const response = {
      ...pageUserData,
      isFollowingAtoB,
      isFollowingBtoA,
      uniqueAlbums: albumCount + trackCount,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}
