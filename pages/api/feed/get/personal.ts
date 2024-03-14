import { prismaClient } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/cache/activity";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 6;

  // Validate input parameters
  if (
    !userId ||
    isNaN(page) ||
    page < 1 ||
    isNaN(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid user ID, page number or limit." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const prisma = prismaClient();

  try {
    // Fetch list of following IDs including the user themselves
    const followingIds = (
      await prisma.follows.findMany({
        where: { followerId: userId, isDeleted: false },
        select: { followingId: true },
      })
    )
      .map((f) => f.followingId)
      .concat(userId);

    // Fetch activities
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

    // Fetch enriched artifacts
    const detailedActivityData = await fetchOrCacheActivities(
      activities.map((activity) => activity.id),
    );

    // Merge detailed data with basic activity data
    const enrichedActivities = activities.map((activity) => ({
      ...activity,
      artifact: {
        ...activity.artifact,
        ...detailedActivityData.find((d) => d.id === activity.id)?.artifact,
        heartedByUser: (activity.artifact?.hearts?.length ?? 0) > 0,
      },
    }));

    // Respond with enriched activities and pagination info
    return new Response(
      JSON.stringify({
        data: {
          activities: enrichedActivities,
          pagination: { nextPage: hasMorePages ? page + 1 : null },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching activities." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
