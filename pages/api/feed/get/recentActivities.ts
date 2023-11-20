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
      where: { OR: [{ type: "HEART" }, { type: "REPLY" }, { type: "RECORD" }] },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit + 1,
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
            caption: true,
            hearts: { where: { authorId: userId } },
            _count: { select: { replies: true, hearts: true } },
          },
        },
        heart: {
          include: {
            author: true,
            record: {
              select: {
                id: true,
                type: true,
                author: true,
                album: true,
                track: true,
                createdAt: true,
                entry: true,
                caption: true,
                hearts: { where: { authorId: userId } },
                _count: { select: { replies: true, hearts: true } },
              },
            },
          },
        },
        reply: {
          include: {
            author: true,
            record: {
              select: {
                id: true,
                type: true,
                author: true,
                album: true,
                track: true,
                createdAt: true,
                entry: true,
                caption: true,
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
    const uniqueRecords = new Map();
    const activitiesWithUserHeart = activities
      .filter((activity) => {
        const recordId =
          activity.record?.id ||
          activity.heart?.record?.id ||
          activity.reply?.record?.id;
        if (recordId && uniqueRecords.has(recordId)) return false;
        if (recordId) uniqueRecords.set(recordId, true);
        return true;
      })
      .map((activity) => {
        const modifiedActivity = {
          ...activity,
          record: activity.record && addHeartedByUser(activity.record),
          heart: activity.heart && {
            ...activity.heart,
            record: addHeartedByUser(activity.heart.record),
          },
          reply: activity.reply && {
            ...activity.reply,
            record: addHeartedByUser(activity.reply.record),
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
