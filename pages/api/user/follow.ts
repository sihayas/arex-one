import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { followerId, followingId } = req.body;

  if (req.method === "POST") {
    try {
      const follow = await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });

      res.status(200).json(follow);
    } catch (error) {
      console.error("Error creating follow relationship:", error);
      res.status(500).json({ error: "Failed to create follow relationship." });
    }
  } else {
    res
      .status(405)
      .json({ error: "This endpoint only supports POST requests." });
  }
}
