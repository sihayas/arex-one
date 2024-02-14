import type { NextApiRequest, NextApiResponse } from "next";
import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/appleTypes";
import { fetchSoundsByTypes } from "@/lib/global/musicKit";

type ResponseData = {
  albums: Map<string, AlbumData | null>;
  songs: Map<string, SongData | null>;
};

const isKeyOfResponseData = (key: string): key is keyof ResponseData =>
  ["albums", "songs"].includes(key);

export async function fetchAndCacheSoundsByTypes(
  idTypes: any,
): Promise<ResponseData> {
  const responseData: ResponseData = {
    albums: new Map(idTypes.albums.map((id: string) => [id, null])),
    songs: new Map(idTypes.songs.map((id: string) => [id, null])),
  };

  const needToFetch: ResponseData = { albums: new Map(), songs: new Map() };

  for (const type in idTypes) {
    if (isKeyOfResponseData(type)) {
      for (const id of idTypes[type]) {
        const cacheKey = `sound:${type}:${id}:data`;
        const cachedData = await getCache(cacheKey);

        if (!cachedData) {
          needToFetch[type].set(id, null);
        } else {
          responseData[type].set(id, cachedData);
        }
      }
    }
  }

  if (needToFetch.albums.size || needToFetch.songs.size) {
    const fetchIds = {
      albums: Array.from(needToFetch.albums.keys()),
      songs: Array.from(needToFetch.songs.keys()),
    };
    const fetchedData = await fetchSoundsByTypes(fetchIds);

    for (const item of fetchedData) {
      const cacheKey = `sound:${item.type}:${item.id}:data`;

      await setCache(cacheKey, item, 3600);
      // @ts-ignore
      responseData[item.type].set(item.id, item);
    }
  }

  return responseData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const idTypes = JSON.parse(req.query.idTypes as string);
    const responseData = await fetchAndCacheSoundsByTypes(idTypes);

    res.status(200).json({
      albums: Array.from(responseData.albums.values()).filter(Boolean),
      songs: Array.from(responseData.songs.values()).filter(Boolean),
    });
  } catch (error) {
    console.error("Error in /helper/album/get/cachedAlbums:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
