import { setCache, getCache } from "@/lib/global/redis"; // Adjust the path as
import { fetchSoundsByTypes } from "@/lib/global/musicKit";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { idTypes } = req.query;

  const cacheKey = `albumData:${JSON.stringify(idTypes)}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  // If not in cache, fetch from Apple Music API
  const response = await axios.get(
    `https://api.music.apple.com/v1/catalog/us?${idTypes}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = response.data.data;

  // Store the fetched data in Redis
  await setCache(cacheKey, data, 3600); // Cache TTL can be adjusted

  res.status(200).json(data);
}
