import { redis } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/apple";
import { fetchSoundsByTypes } from "@/lib/global/musickit";
import { NextApiRequest, NextApiResponse } from "next";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const idTypes = req.body;
    if (!idTypes) {
      return res.status(400).json({ error: "Missing idTypes parameter." });
    }

    const responseData: ResponseData = {
      albums: new Map(idTypes.albums.map((id: string) => [id, null])),
      songs: new Map(idTypes.songs.map((id: string) => [id, null])),
    };

    const needToFetch: ResponseData = { albums: new Map(), songs: new Map() };

    for (const type in idTypes) {
      if (isKeyOfResponseData(type)) {
        for (const id of idTypes[type]) {
          const cacheKey = `sound:${type}:${id}:data`;
          const cachedData = await redis.get(cacheKey);
          const parsedData = cachedData ? cachedData : null;

          if (!cachedData) {
            needToFetch[type].set(id, null);
          } else {
            // @ts-ignore
            responseData[type].set(id, parsedData);
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
        await redis.setex(cacheKey, 3600, JSON.stringify(item));
        //@ts-ignore
        responseData[item.type].set(item.id, item);
      }
    }

    return res.status(200).json({
      albums: Array.from(responseData.albums.values()).filter(Boolean),
      songs: Array.from(responseData.songs.values()).filter(Boolean),
    });
  } catch (error) {
    console.error("Error caching sounds:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
