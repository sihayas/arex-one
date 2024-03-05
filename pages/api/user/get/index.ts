import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "@/pages/api/cache/sound";
import { fetchOrCacheUser } from "@/pages/api/cache/user";

async function enrichEssentialsWithAlbumData(essentials: Essential[]) {
  if (essentials.length === 0) {
    return essentials;
  }

  const albumIds = essentials.map((e) => e.sound.appleId).join(",");
  const albumData = await fetchAndCacheSoundsByType(albumIds, "albums");
  const albumDataMap = Object.fromEntries(
    // @ts-ignore
    albumData.map((album) => [album.id, album]),
  );

  return essentials.map((essential) => ({
    ...essential,
    appleData: albumDataMap[essential.sound.appleId],
  }));
}

async function countUniqueAlbumsAndTracks(
  userId: string,
): Promise<{ soundCount: number }> {
  const [uniqueAlbumCount] = await Promise.all([
    prisma.artifact.groupBy({
      by: ["soundId"],
      where: { authorId: userId, type: "entry" },
      _count: { soundId: true },
    }),
  ]);

  return {
    soundCount: uniqueAlbumCount.length,
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
      .json({ error: "Signed in Personal is required and must be a string." });
  }

  try {
    let sessionUserData = await fetchOrCacheUser(sessionUserId);
    let pageUserData = await fetchOrCacheUser(pageUserId);

    // Attach album data to essentials
    pageUserData.essentials = await enrichEssentialsWithAlbumData(
      pageUserData.essentials,
    );

    const { soundCount } = await countUniqueAlbumsAndTracks(pageUserId);

    const isFollowingAtoB = pageUserData.followedBy.includes(sessionUserId);
    const isFollowingBtoA = sessionUserData.followedBy.includes(pageUserId);

    const response = {
      ...pageUserData,
      isFollowingAtoB,
      isFollowingBtoA,
      soundCount,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
}

export const runtime = "edge";
