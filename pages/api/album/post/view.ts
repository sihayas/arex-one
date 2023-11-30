// Creates a view for a given soundAppleId and userId
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { getCache } from "@/lib/global/redis";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { userId, id, type, soundType } = req.body;

  try {
    let cacheKey;

    switch (type) {
      case "user":
        cacheKey = `view:user:${id}`;
        break;
      case "sound":
        cacheKey = `view:sound:${soundType}:${id}`;
        break;
      case "artifact":
        cacheKey = `view:activity:artifact:${id}`;
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid type" });
    }

    const cache = await getCache(cacheKey);

    if (cache && cache === userId) {
      return res
        .status(200)
        .json({ success: false, message: "User has already viewed this." });
    }

    const view = await prisma.view.create({
      data: {
        authorId: userId,
        ...(type === "artifact" && { artifactId: id }),
        ...(type === "sound" && { soundId: id }),
        ...(type === "user" && { userId: id }),
      },
    });

    return res
      .status(200)
      .json({ success: false, message: "View already exists" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
