// Cross reference Apple results with rating in cache, utilized in SearchAlbums.tsx
import { searchAlbums } from "../../lib/global/musicKit";
import client from "../../lib/global/redis";

export default async function handler(req, res) {
  const { query } = req.query;

  // Fetch albums from Apple's database
  const appleAlbums = await searchAlbums(query);

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
