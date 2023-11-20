import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/appleTypes";

// For getting specific album data by a list of ids
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { ids } = req.query;

    if (typeof ids !== "string" || ids.length === 0) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const idsArray = ids.split(",");

    let responseData = [];
    let needToFetch = [];

    for (const id of idsArray) {
      const cacheKey = `soundData:albums:${id}`;
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        responseData.push(cachedData);
      } else {
        needToFetch.push(id);
      }
    }

    if (needToFetch.length > 0) {
      const fetchedData = await fetchSoundsByType("albums", needToFetch);
      fetchedData.forEach((item: AlbumData | SongData) => {
        const cacheKey = `soundData:albums:${item.id}`;
        setCache(cacheKey, item, 3600);
        responseData.push(item);
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error in /api/sounds/getByType: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Handler end");
}
