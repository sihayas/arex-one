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

export const runtime = "edge";

export default async function onRequestGet(request: Request) {
  const url = new URL(request.url);
  const appleId = url.searchParams.get("appleId");

  if (!appleId) {
    return new Response(JSON.stringify({ error: "Sound ID is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
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
      return new Response(JSON.stringify({ error: "Sound not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use prisma.raw for raw queries, adjust as necessary for your Prisma version
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

    const ratings = ratingsDistributionResult[0];

    if (!ratings) {
      return new Response(
        JSON.stringify({ error: "No rating distribution data found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Construct the response object
    const responseData = {
      avg_rating: soundInfo.avg_rating,
      ratings_count: soundInfo.ratings_count,
      ratings,
    };

    return new Response(JSON.stringify({ data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
