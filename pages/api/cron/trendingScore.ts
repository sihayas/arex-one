import { updateTrendingScores } from "@/lib/updateTrendingScore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST" || req.method === "GET") {
    try {
      await updateTrendingScores();
      res.status(200).json({ message: "Successfully updated trending score." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update trending score." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
