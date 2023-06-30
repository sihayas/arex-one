//Test update album rating cron job, uses POST method
import { NextApiRequest, NextApiResponse } from "next";
import {
  updateAlbumRatings,
  repopulateAllAlbumRatings,
} from "../../lib/updateAlbumRating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await updateAlbumRatings();
      return res
        .status(200)
        .json({ message: "Album ratings updated successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update album ratings." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
