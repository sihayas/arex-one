import { updateAlbumRatings } from "@/lib/updateAlbumRating";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST" || req.method === "GET") {
    try {
      await updateAlbumRatings();
      res.status(200).json({ message: "Successfully updated album ratings." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update album ratings." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
