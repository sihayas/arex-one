import { NextApiRequest, NextApiResponse } from "next";
import { bloomingActivities } from "@/lib/cron/bloomingActivities";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST" || req.method === "GET") {
    try {
      await bloomingActivities();
      res
        .status(200)
        .json({ message: "Successfully updated artifact blooming scores." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update artifact blooming scores." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
