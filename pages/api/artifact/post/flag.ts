import { prisma } from "@/lib/global/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  console.log("flag.ts: req.body", req.body);
  const { referenceId, type, authorId } = req.body;
  if (!referenceId || !type) {
    return res
      .status(400)
      .json({ error: "Missing required fields: referenceId and type." });
  }

  try {
    // Create a flag in the database
    const flag = await prisma.flag.create({
      data: {
        referenceId,
        type,
        flaggedById: authorId,
      },
    });

    return res.status(201).json(flag);
  } catch (error) {
    console.error("Error flagging content:", error);
    return res.status(500).json({ error: "Failed to flag content." });
  }
}
