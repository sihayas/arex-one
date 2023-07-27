import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { followerId, followingId } = req.query;

  if (req.method === "DELETE") {
    try {
      const unfollow = await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: String(followerId),
            followingId: String(followingId),
          },
        },
      });

      res.status(200).json(unfollow);
    } catch (error) {
      console.error("Error deleting follow relationship:", error);
      res.status(500).json({ error: "Failed to remove follow relationship." });
    }
  } else {
    res
      .status(405)
      .json({ error: "This endpoint only supports DELETE requests." });
  }
}
