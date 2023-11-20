import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { getCache, setCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ids = Array.isArray(req.query.ids)
    ? req.query.ids
    : req.query.ids?.split(",");

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (!userId || !ids || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "User ID and valid activity IDs are required." });
  }

  try {
    const activitiesResponse = await Promise.all(
      ids.map(async (id) => {
        // Check cache for activity
        const cacheKey = `activity:${id}`;
        let activityData = await getCache(cacheKey);

        if (!activityData) {
          // Fetch activity from database if not in cache
          activityData = await prisma.activity.findUnique({
            where: { id },
            include: {
              record: {
                select: {
                  id: true,
                  type: true,
                  author: true,
                  album: true,
                  track: true,
                  createdAt: true,
                  entry: true,
                  _count: { select: { replies: true, hearts: true } },
                  hearts: { where: { authorId: userId } },
                },
              },
            },
          });
          await setCache(cacheKey, activityData, 3600);
          return activityData;
        } else {
          // Fetch and merge dynamic data from database with static data from cache
          const dynamicData = await prisma.activity.findUnique({
            where: { id },
            include: {
              record: {
                select: {
                  hearts: { where: { authorId: userId } },
                  _count: { select: { replies: true, hearts: true } },
                },
              },
            },
          });

          const mergedRecord =
            dynamicData && dynamicData.record
              ? {
                  ...activityData.record,
                  ...dynamicData.record,
                  heartedByUser: dynamicData.record.hearts?.length > 0,
                }
              : activityData.record;

          return {
            ...activityData,
            record: mergedRecord,
          };
        }
      }),
    );

    return res.status(200).json(activitiesResponse);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ error: "Error fetching activities." });
  }
}
