import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { getActivityData } from "@/services/activityServices";
import { Activity } from "@/types/dbTypes";

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

  // Validation
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

    // Fetch following activity artifacts
    const activities = await prisma.activity.findMany({
      where: { artifact: { authorId: { in: followingIds } }, type: "artifact" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
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

    // Extract activity IDs
    const activityIds = activities.map((activity) => activity.id);
    // Extract author IDs
    const authorIds = activities.map((activity) => activity.artifact.authorId);
    // Extract sound IDs
    const soundIds = activities.map(
      (activity) => activity.artifact.sound.appleId,
    );

    // Fetch cached activity data using getActivityData
    const detailedActivityData = await getActivityData(activityIds);

    // Merge detailed data with basic activity data
    const enrichedActivities = activities.map((activity) => ({
      ...activity,
      artifact: {
        ...activity.artifact,
        ...detailedActivityData.find((d) => d.id === activity.id)?.artifact,
        heartedByUser: (activity.artifact?.hearts?.length ?? 0) > 0,
      },
    }));

    const hasMorePages = activities.length > limit;
    if (hasMorePages) activities.pop();
    s;

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

async function enrichActivities(activities: any, userId: any) {
  const artifactData = await getActivityData(
    activities.map((a: Activity) => a.artifact?.id),
  );
  const authorData = {};
  const soundData = {};

  // Enrich activities with artifact, author, and sound data
  const enrichedActivities = await Promise.all(
    activities.map(async (a: Activity) => {
      const artifact = artifactData.find((ad) => ad.id === a.artifact?.id);
      const author =
        authorData[artifact.authorId] ||
        (await getAuthorData(artifact.authorId));
      const sound =
        soundData[artifact.soundId] || (await getSoundData(artifact.soundId));

      // Cache the fetched author and sound data
      authorData[artifact.authorId] = author;
      soundData[artifact.soundId] = sound;

      return {
        ...activity,
        artifact: {
          ...artifact,
          author,
          sound,
          heartedByUser: artifact.hearts.some(
            (heart) => heart.authorId === userId,
          ),
        },
      };
    }),
  );

  return enrichedActivities;
}
