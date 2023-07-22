import { prisma } from "@/lib/prisma";
import client from "../../../lib/redis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const albums = await prisma.album.findMany({
      select: { id: true, name: true },
    });

    // Map over the album IDs to fetch their trending scores from Redis.
    // This uses the 'Promise.all' method to perform all the fetches in parallel,
    // improving the performance of this operation.
    const trendingScores = await Promise.all(
      albums.map(async (album) => {
        const score = await client.get(`album:${album.id}:trendingScore`);
        return {
          id: album.id,
          score: score ? parseFloat(score) : 0,
          name: album.name,
        };
      })
    );

    // Sort the album IDs by their trending score.
    trendingScores.sort((a, b) => b.score - a.score);

    // Return the sorted album IDs as a JSON response.
    res.status(200).json(trendingScores);
  } else {
    res.status(405).send("Method not allowed");
  }
}
