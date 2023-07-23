import client from "../../../lib/redis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const albumIds = await client.zrange("trendingAlbums", start, end);

    res.status(200).json(albumIds);
  } else {
    res.status(405).send("Method not allowed");
  }
}
