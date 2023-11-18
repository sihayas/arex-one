import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createEntryRecordActivity } from "@/pages/api/middleware/createActivity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { text, userId, appleAlbumId, appleTrackId, media, link } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Determine sound type and record type
      const type = appleTrackId ? "track" : "album";

      // Verify the album or track with the specified appleId exists
      const appleId = appleTrackId || appleAlbumId;

      // @ts-ignore
      const item = await prisma[type].findUnique({ where: { appleId } });

      if (!item) {
        console.error(`No ${type} found with the specified appleId`, appleId);
        return;
      }

      // Create a new record of type caption
      const newRecord = await prisma.record.create({
        data: {
          type: "CAPTION",
          author: { connect: { id: userId } },
          album: type === "album" ? { connect: { id: item.id } } : undefined,
          track: type === "track" ? { connect: { id: item.id } } : undefined,
        },
      });

      const newCaption = await prisma.caption.create({
        data: {
          text,
          recordId: newRecord.id,
          media,
          link,
        },
      });

      return { newRecord, newCaption };
    });

    if (!result) {
      return res.status(500).json({ error: "Failed to create record.caption" });
    }

    // Finally, create activity
    try {
      await createEntryRecordActivity(result.newRecord.id);
    } catch (error) {
      console.error("Failed to create activity:", error);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
