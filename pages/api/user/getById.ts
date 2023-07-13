import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log("userId", id);

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          likes: {
            include: {
              album: true,
            },
          },
          reviews: {
            include: {
              album: true,
              likes: true,
              replies: true,
            },
          },
          replies: {
            include: {
              parent: true,
              likes: true,
            },
          },
          accounts: true,
          sessions: true,
          profile: {
            include: {
              favorites: {
                include: {
                  album: true,
                },
              },
            },
          },
        },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
