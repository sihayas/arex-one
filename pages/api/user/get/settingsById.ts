import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function getSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: String(userId) },
    });

    return settings
      ? res.status(200).json(settings)
      : res.status(404).json({ error: "Settings not found for this user" });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ error: "Error fetching settings." });
  }
}
