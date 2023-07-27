import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { signedInUserId, userId } = req.query;

  if (req.method === "GET") {
    try {
      const follow = await prisma.follows.findFirst({
        where: {
          followerId: String(signedInUserId),
          followingId: String(userId),
        },
      });

      const isFollowing = follow != null;
      res.status(200).json({ isFollowing });
    } catch (error) {
      console.error("Error retrieving follow status:", error);
      res.status(500).json({ error: "Failed to retrieve follow status." });
    }
  } else {
    res
      .status(405)
      .json({ error: "This endpoint only supports GET requests." });
  }
}
