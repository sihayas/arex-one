import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  let ids = req.query.ids;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  // Split the ids string into an array, if it's a string
  if (typeof ids === "string") {
    ids = ids.split(",");
  }

  // Validation
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Valid activity IDs are required." });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        id: {
          in: ids,
        },
      },
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
            hearts: {
              where: { authorId: userId },
            },
            _count: {
              select: { replies: true, hearts: true },
            },
          },
        },
        follow: true,
        heart: true,
        reply: true,
      },
    });

    if (activities) {
      const activitiesWithUserHeart = activities.map((activity) => {
        if (activity.record) {
          return {
            ...activity,
            record: {
              ...activity.record,
              heartedByUser: activity.record.hearts.length > 0,
            },
          };
        }
        return activity;
      });

      res.status(200).json(activitiesWithUserHeart);
    } else {
      console.log("Activities not found for trending ids:", ids);
      res.status(404).json({ error: "Activities not found." });
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Error fetching activities." });
  }

  res.status(405).json({ error: "Method not allowed." });
}
