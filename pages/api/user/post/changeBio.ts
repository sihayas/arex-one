import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, bio } = req.body;

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });
  if (typeof bio !== "string" || bio.length > 240)
    return res.status(400).json({ error: "Invalid bio." });

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { bio },
    });
    console.log("Successfully updated bio for user:", updatedUser);
    return res.status(200).json({ message: "Bio updated successfully." });
  } catch (error) {
    console.error("Error updating bio:", error);
    return res.status(500).json({ error: "Error updating bio." });
  }
};

// export const runtime = "edge";
