import { setCache, getCache } from "@/lib/global/redis";
import { AlbumData, SongData } from "@/types/appleTypes";
import { fetchSoundsByType, fetchSoundsByTypes } from "@/lib/global/musicKit";

export default async function onRequestGet(request: any) {
  try {
    const url = new URL(request.url);
    const idTypesParam = url.searchParams.get("idTypes");
    if (!idTypesParam) {
      return new Response(
        JSON.stringify({ error: "Missing idTypes parameter." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const idTypes = JSON.parse(idTypesParam);
    const responseData = await fetchAndCacheSoundsByTypes(idTypes);

    return new Response(
      JSON.stringify({
        albums: Array.from(responseData.albums.values()).filter(Boolean),
        songs: Array.from(responseData.songs.values()).filter(Boolean),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in /api/cache/sounds", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

type ResponseData = {
  albums: Map<string, AlbumData | null>;
  songs: Map<string, SongData | null>;
};

const isKeyOfResponseData = (key: string): key is keyof ResponseData =>
  ["albums", "songs"].includes(key);

// Fetch and cache sounds by type*S
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
        const parsedData = cachedData ? cachedData : null;

        if (!cachedData) {
          needToFetch[type].set(id, null);
        } else {
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
      await setCache(cacheKey, JSON.stringify(item), 3600);
      // @ts-ignore
      responseData[item.type].set(item.id, item);
    }
  }

  return responseData;
}

// Fetch and cache sounds by type
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
      setCache(`sound:${type}:${data.id}:data`, JSON.stringify(data), 3600);
      responseDataMap.set(needToFetch[index], data);
    });
  }

  return Array.from(responseDataMap.values()).filter(Boolean);
}
