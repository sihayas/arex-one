import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { AlbumData } from "@/types/appleTypes";
import { getCache, setCache } from "@/lib/global/redis";

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

export async function fetchAndCacheSoundsByType(ids: any, type: string) {
  const idsArray = ids.split(",");
  let responseData: AlbumData[] = [];
  let needToFetch: string[] = [];

  // Check the cache for all IDs at once
  const cacheResponses = await Promise.all(
    idsArray.map((id: string) =>
      getCache(
        type === "albums"
          ? `sound:albums:${id}:data`
          : `sound:songs:${id}:albumId`,
      ),
    ),
  );

  cacheResponses.forEach((cachedData, index) => {
    if (cachedData) {
      responseData.push(cachedData);
    } else {
      needToFetch.push(idsArray[index]);
    }
  });

  // Fetch data not found in cache
  if (needToFetch.length > 0) {
    const fetchedData = await fetchSoundsByType(type, needToFetch);

    // Process fetched data, cache it, and add to response
    fetchedData.forEach((data: AlbumData, index: number) => {
      const key =
        type === "albums"
          ? `sound:albums:${data.id}:data`
          : `sound:songs:${needToFetch[index]}:albumId`;
      // Key is albumId for songs, and album data for albums
      setCache(key, type === "albums" ? data : data.id, 3600);
      responseData.push(data);
    });
  }

  return responseData;
}
