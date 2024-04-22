import { AlbumData, SongData } from "@/types/appleTypes";
import {
  redis,
  soundDataKey,
  soundDbToAppleIdMap,
  soundAppleToDbIdMap,
} from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const appleId = Array.isArray(req.query.appleId)
    ? req.query.appleId[0]
    : req.query.appleId;

  if (!appleId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Check cache for sound id in database
    let soundId: string | null = await redis.hget(
      soundDbToAppleIdMap(),
      appleId,
    );

    if (!soundId) {
      //   Check if sound exists in database
      const sound = await prisma.sound.findUnique({
        where: { apple_id: appleId },
        select: { id: true },
      });

      if (!sound) {
        return res.status(204).end();
      }

      // Cache the sound id mapping
      await redis.hset(soundDbToAppleIdMap(), {
        [appleId]: sound.id,
      });
      await redis.hset(soundAppleToDbIdMap(), {
        [sound.id]: appleId,
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
      return res.status(200).json({ soundData });
    }
  } catch (error) {
    console.error("Error fetching sound data.", error);
    return res.status(500).json({ error: "Error fetching sound data." });
  }
}

type ResponseData = {
  albums: Map<string, AlbumData | null>;
  songs: Map<string, SongData | null>;
};
