import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

interface Ratings {
  "0.5-1": number;
  "1.5-2": number;
  "2.5-3": number;
  "3.5-4": number;
  "4.5-5": number;
}

interface SoundInfo {
  avg_rating: number | null;
  ratings_count: number | null;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const appleId =
    typeof req.query.appleId === "string" ? req.query.appleId : null;

  if (!appleId) {
    return res.status(400).json({ error: "Sound ID is required." });
  }

  try {
    const soundInfo: SoundInfo | null = await prisma.sound.findUnique({
      where: { appleId },
      select: {
        avg_rating: true,
        ratings_count: true,
      },
    });

    if (!soundInfo) {
      return res.status(404).json({ error: "Sound not found." });
    }

    const ratingsDistributionResult: Ratings[] = await prisma.$queryRaw<
      Ratings[]
    >`
      SELECT
        SUM(CASE WHEN c.rating BETWEEN 0.5 AND 1 THEN 1 ELSE 0 END) AS "0.5-1",
        SUM(CASE WHEN c.rating BETWEEN 1.5 AND 2 THEN 1 ELSE 0 END) AS "1.5-2",
        SUM(CASE WHEN c.rating BETWEEN 2.5 AND 3 THEN 1 ELSE 0 END) AS "2.5-3",
        SUM(CASE WHEN c.rating BETWEEN 3.5 AND 4 THEN 1 ELSE 0 END) AS "3.5-4",
        SUM(CASE WHEN c.rating BETWEEN 4.5 AND 5 THEN 1 ELSE 0 END) AS "4.5-5"
      FROM Artifact a
      JOIN Content c ON a.id = c.artifactId
      JOIN Sound s ON a.soundId = s.id
      WHERE s.appleId = ${appleId} AND a.type = 'entry'
    `;

    // Since the raw query returns an array, access the first element directly
    const ratings = ratingsDistributionResult[0];

    if (!ratings) {
      return res
        .status(404)
        .json({ error: "No rating distribution data found." });
    }

    return res.status(200).json({
      data: {
        avg_rating: soundInfo.avg_rating,
        ratings_count: soundInfo.ratings_count,
        ratings,
      },
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const runtime = "edge";
