import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function changeEssential(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, prevEssentialId, appleId, rank } = req.body;

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });
  if (typeof rank !== "number" || rank < 0 || rank > 2)
    return res.status(400).json({ error: "Invalid rank." });

  try {
    const appleAlbum = await prisma.sound.findFirst({ where: { appleId } });
    if (!appleAlbum) return res.status(404).json({ error: "Album not found." });

    await prisma.essential.deleteMany({ where: { id: prevEssentialId } });

    const newEssential = await prisma.essential.create({
      data: { userId, soundId: appleAlbum.id, rank },
    });

    console.log("Successfully changed essential. New essential:", newEssential);
    return res.status(200).json(newEssential);
  } catch (error) {
    console.error("Error changing essential:", error);
    return res.status(500).json({ error: "Error changing essential." });
  }
}

export const runtime = "edge";
