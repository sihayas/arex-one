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

  const { rating, loved, text, userId, appleAlbumId, appleTrackId } = req.body;
  const type = appleTrackId ? "track" : "album";
  const appleId = appleTrackId || appleAlbumId;

  try {
    //@ts-ignore
    const item = await prisma[type].findUnique({ where: { appleId } });
    if (!item) throw new Error(`No ${type} found with the specified appleId`);

    const existingEntry = await prisma.record.findFirst({
      where: {
        authorId: userId,
        type: "ENTRY",
        OR: [
          { albumId: type === "album" ? item.id : undefined },
          { trackId: type === "track" ? item.id : undefined },
        ],
      },
      include: { entry: true },
    });

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
        replay: !!existingEntry,
        recordId: newRecord.id,
      },
    });

    await createEntryRecordActivity(newRecord.id);
    res.status(201).json({ newRecord, newEntry });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review." });
  }
}
