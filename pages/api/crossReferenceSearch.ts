// Cross reference Apple results with rating in cache, utilized in SearchAlbums.tsx
import { NextApiRequest, NextApiResponse } from "next";
import { searchAlbums } from "../../lib/global/musicKit";
import client from "../../lib/global/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (typeof query === "undefined") {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }

  // Convert query to string if it's an array
  const keyword = typeof query === "string" ? query : query.join(" ");

  // Fetch albums from Apple's database
  const appleAlbums = await searchAlbums(keyword);

  // Cross-reference the Apple albums with our own database
  for (const album of appleAlbums) {
    const averageRating = await client.get(`album:${album.id}:averageRating`);

    if (averageRating !== null) {
      album.averageRating = parseFloat(averageRating);
    } else {
      album.averageRating = "n/a"; // default value
    }
  }

  res.json(appleAlbums);
}
