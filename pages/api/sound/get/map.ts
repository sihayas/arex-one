import { NextApiRequest, NextApiResponse } from "next";
import { redis, soundAppleToDbIdMap } from "@/lib/global/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const appleId = Array.isArray(req.query.appleId)
    ? req.query.appleId[0]
    : req.query.appleId;

  if (!appleId) return res.status(400).json({ error: "Apple ID is required." });

  try {
    const dbSoundId = await redis.hget(soundAppleToDbIdMap(), appleId);

    if (dbSoundId) {
      res.status(200).json({ dbSoundId });
    } else {
      res.status(404).json({ error: "Apple ID to Sound ID not mapped." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
}
