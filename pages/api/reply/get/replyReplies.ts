import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";

const MAX_PAGE_SIZE = 100; // Maximum allowed pageSize

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { replyId, pageSize = 10, lastId = null, userId } = req.query;

  // Input validation
  if (Number(pageSize) < 1 || Number(pageSize) > MAX_PAGE_SIZE) {
    return res.status(400).json({
      error: `Invalid pageSize. Must be an integer between 1 and ${MAX_PAGE_SIZE}`,
    });
  }

  if (lastId !== null && !Number.isInteger(Number(lastId))) {
    return res
      .status(400)
      .json({ error: "Invalid lastId. Must be an integer" });
  }

  if (typeof replyId !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid replyId. Must be a string." });
  }

  if (userId !== undefined && typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId. Must be a string." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const replies = await prisma.reply.findMany({
      where: { replyToId: String(replyId) },
      take: Number(pageSize),
      cursor: lastId ? { id: String(lastId) } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        author: true,
        replyToId: true,
        rootId: true,
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
