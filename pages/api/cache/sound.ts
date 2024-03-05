import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { AlbumData } from "@/types/appleTypes";
import { getCache, setCache } from "@/lib/global/redis";

export async function fetchAndCacheSoundsByType(ids: any, type: string) {
  const idsArray = ids.split(",");
  let responseDataMap = new Map(idsArray.map((id: string) => [id, null]));
  let needToFetch: string[] = [];

  // Check the cache for all IDs at once
  const cacheResponses = await Promise.all(
    idsArray.map((id: string) => getCache(`sound:${type}:${id}:data`)),
  );

  const promises = cacheResponses.map(async (cachedData, index) => {
    const id = idsArray[index];

    if (!cachedData) {
      needToFetch.push(id);
      return;
    }

    responseDataMap.set(id, cachedData);
  });

  await Promise.all(promises);

  // Fetch data not found in cache
  if (needToFetch.length > 0) {
    const fetchedData = await fetchSoundsByType(type, needToFetch);
    fetchedData.forEach((data: AlbumData, index: number) => {
      setCache(`sound:${type}:${data.id}:data`, data, 3600);
      responseDataMap.set(needToFetch[index], data);
    });
  }

  return Array.from(responseDataMap.values()).filter(Boolean);
}

// Returns apple album objects given a list of type of IDs
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { ids, type } = req.query;
    if (
      typeof ids !== "string" ||
      ids.length === 0 ||
      typeof type !== "string" ||
      !["albums", "songs"].includes(type)
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const responseData = await fetchAndCacheSoundsByType(ids, type);

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error in /api/sounds/get/sound: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const runtime = "edge";
