import { prismaClient } from "@/lib/global/prisma";
import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "../../cache/sounds";
import { fetchOrCacheUser } from "../../cache/user";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);

  const sessionUserId = url.searchParams.get("sessionUserId");
  const pageUserId = url.searchParams.get("pageUserId");

  if (!sessionUserId || !pageUserId) {
    console.log("Missing parameters");
    return new Response(JSON.stringify({ error: "Required parameters are missing." }), {
      status: 400,
    });
  }

  try {
    let sessionUserData = await fetchOrCacheUser(sessionUserId);
    let pageUserData = await fetchOrCacheUser(pageUserId);

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

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Error fetching user." }), {
      status: 500,
    });
  }
}

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
  const prisma = prismaClient();

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

export const runtime = "edge";
