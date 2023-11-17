import { NextApiRequest, NextApiResponse } from "next";
import { updateBloomingEntryScores } from "@/lib/cron/updateBloomingEntryScores";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST" || req.method === "GET") {
    try {
      await updateBloomingEntryScores();
      res
        .status(200)
        .json({ message: "Successfully updated record blooming scores." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update record blooming scores." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
