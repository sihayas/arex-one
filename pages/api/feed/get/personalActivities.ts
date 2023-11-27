import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

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
    const following = await prisma.follows.findMany({
      where: { followerId: userId, isDeleted: false },
    });
    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    const activities = await prisma.activity.findMany({
      where: { artifact: { authorId: { in: followingIds } } },
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
            hearts: { where: { authorId: userId } },
            _count: { select: { replies: true, hearts: true } },
            content: true,
            sound: true,
          },
        },
        heart: true,
        reply: true,
      },
    });

    const hasMorePages = activities.length > limit;
    if (hasMorePages) activities.pop();

    const activitiesWithUserHeart = activities.map((activity) => ({
      ...activity,
      artifact: activity.artifact && {
        ...activity.artifact,
        heartedByUser: activity.artifact.hearts.length > 0,
      },
    }));

    return res.status(200).json({
      data: {
        activities: activitiesWithUserHeart,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ error: "Error fetching activities." });
  }
}
