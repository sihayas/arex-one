import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

const addHeartedByUser = (record: any) => ({
  ...record,
  heartedByUser: record.hearts.length > 0,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "Invalid page number or limit." });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        OR: [{ type: "heart" }, { type: "reply" }, { type: "artifact" }],
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit + 1,
      include: {
        artifact: {
          select: {
            id: true,
            type: true,
            author: true,
            createdAt: true,
            content: true,
            sound: true,
            hearts: { where: { authorId: userId } },
            _count: { select: { replies: true, hearts: true } },
          },
        },
        heart: {
          include: {
            author: true,
            artifact: {
              select: {
                id: true,
                type: true,
                author: true,
                createdAt: true,
                content: true,
                sound: true,
                hearts: { where: { authorId: userId } },
                _count: { select: { replies: true, hearts: true } },
              },
            },
          },
        },
        reply: {
          include: {
            author: true,
            artifact: {
              select: {
                id: true,
                type: true,
                author: true,
                createdAt: true,
                content: true,
                sound: true,
                hearts: { where: { authorId: userId } },
                _count: { select: { replies: true, hearts: true } },
              },
            },
          },
        },
      },
    });

    // Pagination logic
    const hasMorePages = activities.length > limit;
    if (hasMorePages) activities.pop();

    // Remove duplicate records and add heartedByUser property
    const uniqueArtifacts = new Map();
    const activitiesWithUserHeart = activities
      .filter((activity) => {
        const artifactId =
          activity.artifact?.id ||
          activity.heart?.artifact?.id ||
          activity.reply?.artifact?.id;
        if (artifactId && uniqueArtifacts.has(artifactId)) return false;
        if (artifactId) uniqueArtifacts.set(artifactId, true);
        return true;
      })
      .map((activity) => {
        const modifiedActivity = {
          ...activity,
          artifact: activity.artifact && addHeartedByUser(activity.artifact),
          heart: activity.heart && {
            ...activity.heart,
            artifact: addHeartedByUser(activity.heart.artifact),
          },
          reply: activity.reply && {
            ...activity.reply,
            record: addHeartedByUser(activity.reply.artifact),
          },
        };
        return modifiedActivity;
      });

    res.status(200).json({
      data: {
        activities: activitiesWithUserHeart,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    res
      .status(500)
      // @ts-ignore
      .json({ error: `Failed to fetch activities: ${error.message}` });
  }
}
