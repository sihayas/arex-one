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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const idTypes = JSON.parse(req.query.idTypes as string);
    const responseData: ResponseData = {
      albums: new Map(idTypes.albums.map((id: string) => [id, null])),
      songs: new Map(idTypes.songs.map((id: string) => [id, null])),
    };

    // Initialize maps for data that needs to be fetched
    const needToFetch: ResponseData = { albums: new Map(), songs: new Map() };

    // Check cache and update maps
    for (const type in idTypes) {
      if (isKeyOfResponseData(type)) {
        for (const id of idTypes[type]) {
          const cacheKey = `sound:${type}:${id}:data`;
          const cachedData = await getCache(cacheKey);

          if (!cachedData) {
            needToFetch[type].set(id, null);
            continue;
          } else {
            responseData[type].set(id, cachedData);
          }
        }
      }
    }

    // Fetch missing data
    if (needToFetch.albums.size || needToFetch.songs.size) {
      const fetchIds = {
        albums: Array.from(needToFetch.albums.keys()),
        songs: Array.from(needToFetch.songs.keys()),
      };
      const fetchedData = await fetchSoundsByTypes(fetchIds);

      fetchedData.forEach((item: AlbumData | SongData) => {
        const isSong = item.type === "songs";
        const cacheKey = `sound:${item.type}:${item.id}:${
          isSong ? "albumId" : "data"
        }`;

        // Cache the song data if the item is a song
        if (isSong) {
          const songDataKey = `sound:songs:${item.id}:data`;
          setCache(songDataKey, item, 3600);
        }
        // Cache the song id -> album id if the item is a song
        const dataToCache = isSong
          ? (item as SongData).relationships.albums.data[0].id
          : item;

        // Cache the item data and update the response data
        setCache(cacheKey, dataToCache, 3600);
        // @ts-ignores
        responseData[item.type].set(item.id, item);
      });
    }

    res.status(200).json({
      albums: Array.from(responseData.albums.values()).filter(Boolean),
      songs: Array.from(responseData.songs.values()).filter(Boolean),
    });
  } catch (error) {
    console.error("Error in /apiHelper/album/get/cachedAlbums:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
