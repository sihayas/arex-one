import { NextApiRequest, NextApiResponse } from "next";
import { generateConsensusForAlbums } from "@/lib/global/openAI";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST" || req.method === "GET") {
    try {
      await generateConsensusForAlbums();
      res.status(200).json({ message: "Successfully updated consensus'" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update consensus'." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
