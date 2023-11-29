import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  const { artifactId } = req.query;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  if (artifactId !== undefined && typeof artifactId !== "string") {
    return res.status(400).json({ error: "Invalid artifact ID." });
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  // Validation
  if (
    !userId ||
    isNaN(page) ||
    page < 1 ||
    isNaN(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return res
      .status(400)
      .json({ error: "Invalid user ID, page number or limit." });
  }

  try {
    const replies = await prisma.reply.findMany({
      where: { artifactId, rootId: null },
      take: Number(6),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        author: true,
        rootId: true,
        replyToId: true,
        hearts: { select: { id: true }, where: { authorId: userId } },
        replies: { select: { author: { select: { image: true } } }, take: 3 },
        text: true,
        artifactId: true,
        _count: { select: { replies: true, hearts: true } },
      },
    });

    if (!replies) {
      return res.status(404).json({ error: "No replies found." });
    }

    const repliesWithUserHeart = replies.map((reply: any) => ({
      ...reply,
      heartedByUser: reply.hearts.length > 0,
    }));

    return res.status(200).json(repliesWithUserHeart);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({ error: "Error fetching replies." });
  }
}
