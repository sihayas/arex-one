import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSoundsByType } from "@/lib/global/musicKit";
import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData } from "@/types/appleTypes";

// Returns a list of album data given a list of type of IDs
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

    const idsArray = ids.split(",");
    let responseData = [];
    let needToFetch: string[] = [];

    for (const id of idsArray) {
      const songKey = `sound:songs:${id}:albumId`;
      const albumKey = `sound:albums:${id}:data`;

      // Fetch album data from cache & return if found, otherwise add to list of IDs to fetch
      const cachedData = await getCache(type === "albums" ? albumKey : songKey);
      if (cachedData) {
        responseData.push(cachedData);
      } else {
        needToFetch.push(id);
      }
    }

    // Fetch data not found in cache
    if (needToFetch.length > 0) {
      const fetchedData = await fetchSoundsByType(type, needToFetch);
      fetchedData.forEach((album: AlbumData, index: number) => {
        const albumKey = `sound:albums:${album.id}:data`;
        setCache(albumKey, album, 3600);
        responseData.push(album);
        if (type !== "albums") {
          const songKey = `sound:songs:${needToFetch[index]}:albumId`;
          setCache(songKey, album.id, 3600);
        }
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error in /api/sounds/get/sound: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
