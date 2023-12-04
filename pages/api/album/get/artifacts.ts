import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/caches/activity";
import client from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid request method." });
  }

  const soundId = Array.isArray(req.query.soundId)
    ? req.query.soundId.join(",")
    : req.query.soundId;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;
  const type = typeof req.query.type === "string" ? req.query.type : undefined;

  if (!soundId || !userId) {
    return res
      .status(400)
      .json({ error: "Sound ID and Personal ID are required." });
  }

  const sort = req.query.sort || "newest";
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 6;
  const start = (page - 1) * limit;
  const end = start + limit;

  try {
    let activities = [];
    let hasMorePages: boolean;

    if (sort === "newest") {
      activities = await prisma.activity.findMany({
        where: {
          type: "artifact",
          artifact: { type: "entry", sound: { appleId: soundId } },
        },
        orderBy: { createdAt: "desc" },
        skip: start,
        take: limit + 1,
        select: {
          id: true,
          artifact: {
            select: {
              hearts: { where: { authorId: userId } },
              _count: { select: { replies: true, hearts: true } },
            },
          },
          type: true,
        },
      });
      hasMorePages = activities.length > limit;
    } else {
      const rankedActivities = await client.zrevrange(
        `sound:${type}:${soundId}:${sort}:score`,
        start,
        end,
      );
      hasMorePages = rankedActivities.length > limit;

      activities = await prisma.activity.findMany({
        where: { id: { in: rankedActivities } },
        select: {
          id: true,
          artifact: {
            select: {
              hearts: { where: { authorId: userId } },
              _count: { select: { replies: true, hearts: true } },
            },
          },
          type: true,
        },
      });
    }

    if (hasMorePages) activities.pop();

    const activityIds = activities.map((activity) => activity.id);
    const detailedActivityData = await fetchOrCacheActivities(activityIds);

    const enrichedActivities = activities.map((activity, index) => {
      const detailedData = detailedActivityData[index];
      return {
        ...activity,
        artifact: {
          ...activity.artifact,
          ...(detailedData?.artifact ?? {}),
          heartedByUser: (activity.artifact?.hearts?.length ?? 0) > 0,
        },
      };
    });

    return res.status(200).json({
      data: {
        activities: enrichedActivities,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews." });
  }
}
