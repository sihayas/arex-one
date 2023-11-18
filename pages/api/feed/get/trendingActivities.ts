import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ids =
    typeof req.query.ids === "string"
      ? req.query.ids.split(",")
      : req.query.ids;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  // Validation
  if (!userId || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "User ID and valid activity IDs are required." });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { id: { in: ids } },
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
        follow: true,
        heart: true,
        reply: true,
      },
    });

    if (!activities) {
      console.log("Activities not found for trending ids:", ids);
      return res.status(404).json({ error: "Activities not found." });
    }

    const activitiesWithUserHeart = activities.map((activity) => ({
      ...activity,
      record: activity.record && {
        ...activity.record,
        heartedByUser: activity.record.hearts.length > 0,
      },
    }));

    return res.status(200).json(activitiesWithUserHeart);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ error: "Error fetching activities." });
  }
}
