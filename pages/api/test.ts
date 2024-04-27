import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Fetch all entries from the database
    const entries = await prisma.entry.findMany({
      // You can include specific fields to select if necessary
      select: {
        id: true,
        type: true,
        author_id: true,
        sound_id: true,
        text: true,
        rating: true,
        loved: true,
        replay: true,
        is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });

    console.log("entries:", entries);

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch entries." });
  }
}
