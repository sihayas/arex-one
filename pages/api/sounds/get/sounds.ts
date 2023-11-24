import type { NextApiRequest, NextApiResponse } from "next";
import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/appleTypes";
import { fetchSoundsByTypes } from "@/lib/global/musicKit";

type ResponseData = {
  albums: Map<string, AlbumData | null>;
  songs: Map<string, SongData | null>;
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
    let responseData: ResponseData = {
      albums: new Map(idTypes.albums.map((id: string) => [id, null])),
      songs: new Map(idTypes.songs.map((id: string) => [id, null])),
    };
    let needToFetch: ResponseData = { albums: new Map(), songs: new Map() };

    // Check cache and update maps
    for (const type in idTypes) {
      if (isKeyOfResponseData(type)) {
        for (const id of idTypes[type]) {
          const cacheKey = `sound:${type}:${id}:${
            type === "albums" ? "data" : "albumId"
          }`;
          const cachedData = await getCache(cacheKey);

          if (!cachedData) {
            needToFetch[type].set(id, null);
            continue;
          }

          if (type === "songs") {
            // Assume cachedData contains albumId for the song
            const albumData = await getCache(`sound:albums:${cachedData}:data`);
            if (albumData) {
              responseData[type].set(id, albumData);
            } else {
              needToFetch[type].set(id, null);
            }
          } else {
            responseData[type].set(id, cachedData);
          }
        }
      }
    }

    // Fetch missing data
    if (
      Array.from(needToFetch.albums.keys()).length > 0 ||
      Array.from(needToFetch.songs.keys()).length > 0
    ) {
      const fetchIds = {
        albums: Array.from(needToFetch.albums.keys()),
        songs: Array.from(needToFetch.songs.keys()),
      };
      const fetchedData = await fetchSoundsByTypes(fetchIds);

      fetchedData.forEach((item: AlbumData | SongData) => {
        if (isKeyOfResponseData(item.type)) {
          const cacheKey = `sound:${item.type}:${item.id}`;
          setCache(cacheKey, item, 3600);
          responseData[item.type].set(item.id, item);
        }
      });
    }

    res.status(200).json({
      albums: Array.from(responseData.albums.values()).filter(Boolean),
      songs: Array.from(responseData.songs.values()).filter(Boolean),
    });
  } catch (error) {
    console.error("Error in /api/album/get/cachedAlbums:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
