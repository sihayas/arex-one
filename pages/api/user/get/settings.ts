import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function getSettings(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).end("Method not allowed.");
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: String(userId) },
    });

    if (!settings) {
      return res.status(404).end("Settings not found for this user");
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).end("Error fetching settings.");
  }
}

// export const runtime = "edge";
