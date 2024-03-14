import { initializePrisma } from "@/lib/global/prisma";
import { fetchOrCacheActivities } from "@/pages/api/cache/activity";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required." }), {
      status: 400,
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
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit + 1,
      select: {
        id: true,
        artifact: {
          select: {
            // Always fetch up to date replies/hearts
            hearts: { where: { authorId: userId } },
            _count: { select: { replies: true, hearts: true } },
          },
        },
      },
    });

    const hasMorePages = activities.length > limit;
    if (hasMorePages) activities.pop();

    const detailedActivityData = await fetchOrCacheActivities(
      activities.map((activity) => activity.id),
    );

    // Merge detailed data with basic activity data
    const enrichedActivities = activities.map((activity) => ({
      ...activity,
      artifact: {
        // @ts-ignore
        ...activity.artifact,
        ...detailedActivityData.find((d) => d.id === activity.id)?.artifact,
        // @ts-ignore
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
    console.error("Error fetching user entries:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching user entries." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
