import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { artifactId } = req.body;

  try {
    const updatedArtifact = await prisma.artifact.update({
      where: {
        id: artifactId,
      },
      data: {
        isDeleted: true,
      },
    });
    // updating cache, etc.
    res.status(200).json({
      message: "Artifact successfully marked as deleted.",
      updatedArtifact,
    });
  } catch (error) {
    console.error("Failed to mark the artifact as deleted:", error);
    res.status(500).json({ error: "Failed to update artifact status." });
  }
}
