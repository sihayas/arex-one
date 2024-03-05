import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchAndClearUpdateSet } from "@/lib/global/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // Atomically fetch and clear the set of sounds to update
      const appleIdsToUpdate = await fetchAndClearUpdateSet(
        "sounds:averageQueue",
      );

      if (!appleIdsToUpdate || appleIdsToUpdate.length === 0) {
        return res.status(200).json({ message: "No sounds need updating." });
      }

      const globalStats = await prisma.sound.aggregate({
        _avg: { avg_rating: true },
        _sum: { ratings_count: true },
      });

      const M = globalStats._avg.avg_rating || 0;
      const C = 50;

      // Process each sound ID
      for (const appleId of appleIdsToUpdate) {
        const sound = await prisma.sound.findUnique({
          where: { appleId },
        });

        if (sound) {
          const bayesianAvg =
            (C * M + sound.ratings_sum) / (C + sound.ratings_count);

          const regularAvg = parseFloat(
            (sound.ratings_sum / sound.ratings_count).toFixed(1),
          );

          // Update the sound with the new Bayesian average
          await prisma.sound.update({
            where: { id: sound.id },
            data: {
              avg_rating: regularAvg,
              bayesian_avg: bayesianAvg,
            },
          });
        }
      }

      res.status(200).json({
        message: "Bayesian averages updated successfully for flagged sounds.",
      });
    } catch (error) {
      console.error("Failed to update Bayesian averages:", error);
      res.status(500).json({ error: "Failed to perform the calculation" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const runtime = "edge";
