import { fetchSoundsByType, fetchSoundsByTypes } from "@/lib/global/musickit";
import { AlbumData, SongData } from "@/types/appleTypes";
import {
  soundAppleIdMapKey,
  getCache,
  redis,
  setCache,
  soundDataKey,
} from "@/lib/global/redis";
import { createResponse } from "@/pages/api/middleware";
import { prisma } from "@/lib/global/prisma";

interface SoundData {
  name: string;
  avg_rating: number;
  bayesian_avg: number;
  artist_name: string;
  release_date: string;
  "0.5": number;
  "1": number;
  "1.5": number;
  "2": number;
  "2.5": number;
  "3": number;
  "3.5": number;
  "4": number;
  "4.5": number;
  "5": number;
}

export default async function onRequestGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const appleId = searchParams.get("appleId");

  if (!appleId) {
    return createResponse({ error: "Missing parameters" }, 400);
  }

  try {
    // Check cache for sound id in database
    let soundId: string | null = await redis.hget(
      soundAppleIdMapKey(),
      appleId,
    );

    if (!soundId) {
      //   Check if sound exists in database
      const sound = await prisma.sound.findUnique({
        where: { apple_id: appleId },
        select: { id: true },
      });

      if (!sound) {
        return createResponse({ error: "Sound not found in DB." }, 404);
      }

      // Cache the sound id mapping
      await redis.hset(soundAppleIdMapKey(), {
        [appleId]: sound.id,
      });

      soundId = sound.id;
    }

    // Continue to fetch sound data
    let soundInfo = await redis.hgetall(soundDataKey(soundId));

    // If sound data is not found check the database
    if (!soundInfo) {
      const ratingsDistributionResult: SoundData[] = await prisma.$queryRaw<
        SoundData[]
      >`
SELECT
  s.name,
  s.artist_name,
  s.release_date,
  s.avg_rating,
  s.bayesian_avg,
  SUM(CASE WHEN e.rating = 0.5 THEN 1 ELSE 0 END) AS "0.5",
  SUM(CASE WHEN e.rating = 1 THEN 1 ELSE 0 END) AS "1",
  SUM(CASE WHEN e.rating = 1.5 THEN 1 ELSE 0 END) AS "1.5",
  SUM(CASE WHEN e.rating = 2 THEN 1 ELSE 0 END) AS "2",
  SUM(CASE WHEN e.rating = 2.5 THEN 1 ELSE 0 END) AS "2.5",
  SUM(CASE WHEN e.rating = 3 THEN 1 ELSE 0 END) AS "3",
  SUM(CASE WHEN e.rating = 3.5 THEN 1 ELSE 0 END) AS "3.5",
  SUM(CASE WHEN e.rating = 4 THEN 1 ELSE 0 END) AS "4",
  SUM(CASE WHEN e.rating = 4.5 THEN 1 ELSE 0 END) AS "4.5",
  SUM(CASE WHEN e.rating = 5 THEN 1 ELSE 0 END) AS "5"
FROM Entry e
JOIN Sound s ON e.sound_id = s.id
WHERE s.apple_id = ${appleId} AND e.type = 'artifact' AND e.rating IS NOT NULL
GROUP BY s.name, s.artist_name, s.release_date
`;

      let ratings = ratingsDistributionResult[0];
      let totalRatings =
        ratings["0.5"] +
        ratings["1"] +
        ratings["1.5"] +
        ratings["2"] +
        ratings["2.5"] +
        ratings["3"] +
        ratings["3.5"] +
        ratings["4"] +
        ratings["4.5"] +
        ratings["5"];
      let avgRating = ratings.avg_rating;
      let bayesianAvg = ratings.bayesian_avg;
      let soundName = ratingsDistributionResult[0].name;
      let artistName = ratingsDistributionResult[0].artist_name;
      let releaseDate = ratingsDistributionResult[0].release_date;

      // Cache the sound data
      const soundData = {
        avg_rating: avgRating,
        ratings_count: totalRatings,
        bayesian_avg: bayesianAvg,
        sound_name: soundName,
        artist_name: artistName,
        release_date: releaseDate,
      };
      await redis.hset(soundDataKey(soundId), soundData);
      return createResponse({ data: soundData }, 200);
    }
  } catch (error) {
    console.error("Error fetching sound data.", error);
    return createResponse({ error: "Error fetching sound data." }, 500);
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

export const runtime = "edge";
