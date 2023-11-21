import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import client, { getCache, setCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;
  if (!userId) return res.status(400).json({ error: "User ID required." });

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const start = (page - 1) * limit;
  const end = start + limit;

  // Get blooming activities from cache
  const bloomingActivities = await client.zrevrange(
    "activity:blooming",
    start,
    end,
  );
  const hasMorePages = bloomingActivities.length > limit;
  if (hasMorePages) bloomingActivities.pop();

  try {
    const activities = await Promise.all(
      bloomingActivities.map(async (id) => {
        // Check cache for activity
        const cacheKey = `activity:data:${id}`;
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

    return res.status(200).json({
      data: {
        activities,
        pagination: {
          nextPage: hasMorePages ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ error: "Error fetching activities." });
  }
}
