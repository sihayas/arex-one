import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function getUniqueAlbumsByUserId(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  try {
    const artifacts = await prisma.artifact.findMany({
      where: {
        AND: [
          { authorId: userId }, // Artifacts created by the user
          { type: "entry" }, // Artifacts of type 'entry'
        ],
      },
      select: {
        sound: {
          select: {
            appleId: true,
            type: true,
          },
        },
      },
      distinct: ["soundId"],
      skip: (page - 1) * limit,
      take: limit + 1,
    });

    const hasMorePages = artifacts.length > limit;
    if (hasMorePages) artifacts.pop();

    return res.status(200).json({
      data: {
        artifacts: artifacts,
        pagination: { nextPage: hasMorePages ? page + 1 : null },
      },
    });
  } catch (error) {
    console.error("Error fetching unique albums:", error);
    return res.status(500).json({ error: "Error fetching unique albums." });
  }
}
