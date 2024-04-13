// import { prisma } from "@/lib/global/prisma";

// interface Ratings {
//   "0.5-1": number;
//   "1.5-2": number;
//   "2.5-3": number;
//   "3.5-4": number;
//   "4.5-5": number;
// }

// interface SoundInfo {
//   avg_rating: number | null;
//   ratings_count: number | null;
// }

import { fetchSoundsByType, fetchSoundsByTypes } from "@/lib/global/musickit";
import { AlbumData, SongData } from "@/types/appleTypes";
import { getCache, redis, setCache } from "@/lib/global/redis";

export const runtime = "edge";

// export default async function onRequestGet(request: Request) {
//   const url = new URL(request.url);
//   const appleId = url.searchParams.get("appleId");

//   if (!appleId) {
//     return new Response(JSON.stringify({ error: "Sound ID is required." }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   try {
//     let soundInfo: SoundInfo | null = await prisma.sound.findUnique({
//       where: { appleId },
//       select: {
//         avg_rating: true,
//         ratings_count: true,
//       },
//     });

//     // If soundInfo is not found, set default values
//     if (!soundInfo) {
//       soundInfo = { avg_rating: 0, ratings_count: 0 };
//     }

//     const ratingsDistributionResult: Ratings[] = await prisma.$queryRaw<
//       Ratings[]
//     >`
//       SELECT
//         SUM(CASE WHEN c.rating BETWEEN 0.5 AND 1 THEN 1 ELSE 0 END) AS "0.5-1",
//         SUM(CASE WHEN c.rating BETWEEN 1.5 AND 2 THEN 1 ELSE 0 END) AS "1.5-2",
//         SUM(CASE WHEN c.rating BETWEEN 2.5 AND 3 THEN 1 ELSE 0 END) AS "2.5-3",
//         SUM(CASE WHEN c.rating BETWEEN 3.5 AND 4 THEN 1 ELSE 0 END) AS "3.5-4",
//         SUM(CASE WHEN c.rating BETWEEN 4.5 AND 5 THEN 1 ELSE 0 END) AS "4.5-5"
//       FROM Entry a
//       JOIN Content c ON a.id = c.entryId
//       JOIN Sound s ON a.soundId = s.id
//       WHERE s.appleId = ${appleId} AND a.type = 'artifact'
//     `;

//     let ratings = ratingsDistributionResult[0];

//     // If ratings are not found, set default values
//     if (!ratings) {
//       ratings = { "0.5-1": 0, "1.5-2": 0, "2.5-3": 0, "3.5-4": 0, "4.5-5": 0 };
//     }

//     // Construct the response object
//     const responseData = {
//       avg_rating: soundInfo.avg_rating,
//       ratings_count: soundInfo.ratings_count,
//       ratings,
//     };

//     return new Response(JSON.stringify({ data: responseData }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error executing query:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

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
        const cacheKey = `sound:${id}:data`;
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
      const cacheKey = `sound:${item.id}:data`;
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
    idsArray.map((id: string) => getCache(`sound:${id}:data`)),
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
    for (const data of fetchedData) {
      const index: number = fetchedData.indexOf(data);
      await redis.setex(`sound:${data.id}:data`, 3600, JSON.stringify(data));
      responseDataMap.set(needToFetch[index], data);
    }
  }

  return Array.from(responseDataMap.values()).filter(Boolean);
}
