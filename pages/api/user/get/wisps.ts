import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/caches/activity";
import { Activity, ActivityType } from "@/types/dbTypes";
import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";

export default async function getUniqueAlbumsByUserId(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  try {
    const activities = await prisma.activity.findMany({
      where: { artifact: { authorId: userId, type: "wisp" }, type: "artifact" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit + 1,
      select: {
        id: true,
        type: true,
        artifact: {
          select: {
            id: true,
            hearts: { where: { authorId: userId } },
            _count: { select: { replies: true, hearts: true } },
          },
        },
      },
    });

    const hasMorePages = activities.length > limit;
    if (hasMorePages) activities.pop();

    // Extract activity IDs
    const activityIds = activities.map((activity) => activity.id);

    // Fetch enriched artifacts
    const detailedActivityData = await fetchOrCacheActivities(activityIds);

    // Merge detailed data with basic activity data
    const enrichedActivities = activities.map((activity) => ({
      ...activity,
      artifact: {
        ...activity.artifact,
        ...detailedActivityData.find((d) => d.id === activity.id)?.artifact,
        heartedByUser: (activity.artifact?.hearts?.length ?? 0) > 0,
      },
    }));

    // Return enriched activities
    return res.status(200).json({
      data: {
        activities: enrichedActivities,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Error fetching unique albums:", error);
    return res.status(500).json({ error: "Error fetching unique albums." });
  }
}
