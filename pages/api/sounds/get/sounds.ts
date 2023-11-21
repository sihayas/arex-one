import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/appleTypes";
import { baseURL, fetchSoundsByTypes } from "@/lib/global/musicKit";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";

type ResponseData = {
  albums: string[];
  songs: string[];
};

function isKeyOfResponseData(key: string): key is keyof ResponseData {
  return key === "albums" || key === "songs";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const idTypes = JSON.parse(req.query.idTypes as string);
    let needToFetch: ResponseData = { albums: [], songs: [] };
    let responseData: ResponseData = { albums: [], songs: [] };

    // Check cache for each album and song
    for (const type in idTypes) {
      if (isKeyOfResponseData(type)) {
        for (const id of idTypes[type]) {
          const cacheKey = `soundData:${type}:${id}`;
          const cachedData = await getCache(cacheKey);

          if (cachedData) {
            responseData[type].push(cachedData);
          } else {
            needToFetch[type].push(id);
          }
        }
      }
    }

    // Fetch missing data from Apple Music API
    if (needToFetch.albums.length > 0 || needToFetch.songs.length > 0) {
      // Call the fetchSoundsByTypes function
      const fetchedData = await fetchSoundsByTypes(needToFetch);

      // Process the fetched data
      fetchedData.forEach((item: AlbumData | SongData) => {
        if (isKeyOfResponseData(item.type)) {
          const cacheKey = `soundData:${item.type}:${item.id}`;
          setCache(cacheKey, item, 3600);
          // @ts-ignore
          responseData[item.type as keyof ResponseData].push(item);
        }
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in /api/album/get/cachedAlbums:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
