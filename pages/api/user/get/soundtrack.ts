import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function getUniqueAlbumsByUserId(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, page = 1 } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const pageSize = 9;
    const skip = (Number(page) - 1) * pageSize;

    const uniqueAlbums = await prisma.artifact.findMany({
      where: { authorId: String(userId) },
      select: { sound: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      distinct: ["soundId"],
    });

    return uniqueAlbums
      ? res.status(200).json(uniqueAlbums)
      : res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error fetching unique albums:", error);
    return res.status(500).json({ error: "Error fetching unique albums." });
  }
}
