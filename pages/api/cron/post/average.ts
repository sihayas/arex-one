import { prisma } from "@/lib/global/prisma";
import { fetchAndClearUpdateSet } from "@/lib/global/redis";

export default async function onRequestPost(request: any) {
  try {
    // Atomically fetch and clear the set of sounds to update
    const appleIdsToUpdate = await fetchAndClearUpdateSet(
      "sounds:averageQueue",
    );

    if (!appleIdsToUpdate || appleIdsToUpdate.length === 0) {
      return new Response(
        JSON.stringify({ message: "No sounds need updating." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
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

    return new Response(
      JSON.stringify({
        message: "Bayesian averages updated successfully for flagged sounds.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to update Bayesian averages:", error);
    return new Response(
      JSON.stringify({ error: "Failed to perform the calculation" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
