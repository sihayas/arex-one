import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createEntryRecordActivity } from "@/lib/middleware/createActivity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { rating, loved, text, userId, appleAlbumId, appleTrackId } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const type = appleTrackId ? "track" : "album";
      const appleId = appleTrackId || appleAlbumId;
      // Find the album or track with the specified appleId
      const item = await prisma[type].findUnique({ where: { appleId } });

      if (!item) {
        console.error(`No ${type} found with the specified appleId`, appleId);
        return;
      }

      // Check if the user has already submitted an entry
      const existingEntry = await prisma.record.findFirst({
        where: {
          authorId: userId,
          OR: [
            { albumId: type === "album" ? item.id : undefined },
            { trackId: type === "track" ? item.id : undefined },
          ],
        },
        include: { entry: true },
      });
      const replay = !!existingEntry;

      // Create a new record and entry
      const newRecord = await prisma.record.create({
        data: {
          type: "ENTRY",
          author: { connect: { id: userId } },
          album: type === "album" ? { connect: { id: item.id } } : undefined,
          track: type === "track" ? { connect: { id: item.id } } : undefined,
        },
      });

      const newEntry = await prisma.entry.create({
        data: {
          text,
          rating,
          loved,
          replay,
          recordId: newRecord.id,
        },
      });

      return { newRecord, newEntry };
    });

    if (!result) {
      return res.status(500).json({ error: "Failed to create review." });
    }

    // Finally, create activity
    try {
      await createEntryRecordActivity(result.newEntry.id);
    } catch (error) {
      console.error("Failed to create activity:", error);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
