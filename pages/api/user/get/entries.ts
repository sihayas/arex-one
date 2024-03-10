import { initializePrisma } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/cache/activity";

export async function onRequest(request: any) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;

  const prisma = initializePrisma();

  try {
    const activities = await prisma.activity.findMany({
      where: {
        artifact: { authorId: userId, type: "entry" },
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

    // Return enriched activities
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
    console.error("Error fetching unique albums:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching unique albums." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
