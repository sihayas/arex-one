import { initializePrisma } from "@/lib/global/prisma";
import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "../../cache/sound";
import { fetchOrCacheUser } from "../../cache/user";

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
  const prisma = initializePrisma();

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

export async function onRequest(request: any) {
  const url = new URL(request.url);

  // Check for method and extract query parameters
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
    });
  }

  const sessionUserId = url.searchParams.get("sessionUserId");
  const pageUserId = url.searchParams.get("pageUserId");

  if (!sessionUserId || !pageUserId) {
    return new Response(
      JSON.stringify({ error: "Required parameters are missing." }),
      { status: 400 },
    );
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

export const runtime = "edge";
