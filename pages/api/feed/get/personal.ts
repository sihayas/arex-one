import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/cache/activity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  if (
    !userId ||
    isNaN(page) ||
    page < 1 ||
    isNaN(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return res
      .status(400)
      .json({ error: "Invalid user ID, page number or limit." });
  }

  try {
    const followingIds = (
      await prisma.follows.findMany({
        where: { followerId: userId, isDeleted: false },
        select: { followingId: true },
      })
    )
      .map((f) => f.followingId)
      .concat(userId);

    // Fetch bare artifacts
    const activities = await prisma.activity.findMany({
      where: {
        artifact: { authorId: { in: followingIds }, isDeleted: false },
        type: "artifact",
      },
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

    return res.status(200).json({
      data: {
        activities: enrichedActivities,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ error: "Error fetching activities." });
  }
}

// export const runtime = "edge";
