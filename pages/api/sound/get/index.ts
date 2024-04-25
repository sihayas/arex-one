import { AlbumData, SongData } from "@/types/apple";
import { redis, soundAppleToDbIdMap, soundDataKey } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface SoundData {
  id: string;
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
  let soundId = Array.isArray(req.query.soundId)
    ? req.query.soundId[0]
    : req.query.soundId;
  const appleId = Array.isArray(req.query.appleId)
    ? req.query.appleId[0]
    : req.query.appleId;

  if (!appleId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    if (!soundId) {
      // check map to confirm
      const cachedId = await redis.hget(soundAppleToDbIdMap(), appleId);

      // fallback to db, create the hash map of apple id to the db id
      if (!cachedId) {
        const soundInDb = await prisma.sound.findFirst({
          where: { apple_id: appleId },
          select: { id: true },
        });

        if (soundInDb) {
          await redis.hset(soundAppleToDbIdMap(), {
            [appleId]: soundInDb.id,
          });
          soundId = soundInDb.id;
        }
      }
    }

    // sound does not exist in the database, exit
    if (!soundId) {
      return res.status(200).json({ message: "No sound data available yet." });
    }
    let soundData = await redis.hgetall(soundDataKey(soundId));

    if (!soundData) {
      const ratingsDistributionResult: SoundData[] = await prisma.$queryRaw<
        SoundData[]
      >`
SELECT
  s.id,
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
WHERE s.id = ${soundId} AND e.type = 'artifact' AND e.rating IS NOT NULL
GROUP BY s.name, s.artist_name, s.release_date, s.avg_rating, s.bayesian_avg;
`;

      let ratings = ratingsDistributionResult[0];
      let totalRatings = [
        ratings["0.5"],
        ratings["1"],
        ratings["1.5"],
        ratings["2"],
        ratings["2.5"],
        ratings["3"],
        ratings["3.5"],
        ratings["4"],
        ratings["4.5"],
        ratings["5"],
        //@ts-ignore
      ].reduce((acc, rating) => acc + (parseFloat(rating) || 0), 0);
      let id = ratingsDistributionResult[0].id;
      let name = ratingsDistributionResult[0].name;
      let artistName = ratingsDistributionResult[0].artist_name;
      let releaseDate = ratingsDistributionResult[0].release_date;

      let avgRating = ratings.avg_rating;
      let bayesianAvg = ratings.bayesian_avg;

      const formattedData = {
        id: id,
        name: name,
        artist_name: artistName,
        release_date: releaseDate,

        avg_rating: avgRating.toString(),
        ratings_count: totalRatings.toString(),
        bayesian_avg: bayesianAvg.toString(),

        rating_half: ratings["0.5"].toString(),
        rating_one: ratings["1"].toString(),
        rating_one_half: ratings["1.5"].toString(),
        rating_two: ratings["2"].toString(),
        rating_two_half: ratings["2.5"].toString(),
        rating_three: ratings["3"].toString(),
        rating_three_half: ratings["3.5"].toString(),
        rating_four: ratings["4"].toString(),
        rating_four_half: ratings["4.5"].toString(),
        rating_five: ratings["5"].toString(),
      };

      // cache the data
      await redis.hset(soundDataKey(soundId), formattedData);
      soundData = formattedData;
    }

    return res.status(200).json(soundData);
  } catch (error) {
    console.error("Error fetching sound data.", error);
    return res.status(500).json({ error: "Error fetching sound data." });
  }
}

type ResponseData = {
  albums: Map<string, AlbumData | null>;
  songs: Map<string, SongData | null>;
};
