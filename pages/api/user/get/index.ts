import { prisma } from "@/lib/global/prisma";
import { Essential } from "@/types/dbTypes";
import { fetchAndCacheSoundsByType } from "../../cache/sounds";
import { fetchOrCacheUser, fetchOrCacheUserFollowers } from "../../cache/user";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");
  const pageUserId = url.searchParams.get("pageUserId");

  if (!userId || !pageUserId) {
    console.log("Missing parameters");
    return new Response(
      JSON.stringify({ error: "Required parameters are missing." }),
      {
        status: 400,
      },
    );
  }

  try {
    const pageUserData = await fetchOrCacheUser(pageUserId);

    pageUserData.essentials = await attachSoundData(pageUserData.essentials);

    // Check if the user is following the page user
    const userFollowers = await fetchOrCacheUserFollowers(userId);
    const pageUserFollowers = await fetchOrCacheUserFollowers(pageUserId);
    const isFollowingBtoA = userFollowers.includes(pageUserId);
    const isFollowingAtoB = pageUserFollowers.includes(userId);

    return new Response(
      JSON.stringify({
        ...pageUserData,
        isFollowingAtoB,
        isFollowingBtoA,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Error fetching user." }), {
      status: 500,
    });
  }
}

async function attachSoundData(essentials: Essential[]) {
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

export const runtime = "edge";
