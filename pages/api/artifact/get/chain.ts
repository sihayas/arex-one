import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheRoots } from "@/pages/api/caches/reply";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { replyId, cursor } = req.query;
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;

  // Validate replyId
  if (!replyId || typeof replyId !== "string") {
    return res.status(400).json({ error: "Invalid reply ID." });
  }

  // Optionally validate cursor if it's provided
  if (cursor !== undefined && typeof cursor !== "string") {
    return res.status(400).json({ error: "Invalid cursor." });
  }

  const ancestorLimit = 6;
  let currentReplyId = cursor || replyId;
  const replyChain = [];
  let lastReplyId = null;

  try {
    while (replyChain.length < ancestorLimit) {
      const reply = await prisma.reply.findUnique({
        where: { id: currentReplyId },
        select: {
          id: true,
          hearts: { where: { authorId: userId } },
          text: true,
          replyToId: true,
          author: {
            select: { image: true },
          },
        },
      });

      if (!reply || !reply.replyToId) break; // Exit if no reply or no parent

      replyChain.push(reply);
      currentReplyId = reply.replyToId;
      lastReplyId = reply.id; // Update last fetched for pagination
    }

    if (!replyChain || replyChain.length === 0) {
      return res.status(404).json({ error: "No replies found." });
    }

    const replyIds = replyChain.map((reply) => reply.id);

    const detailedReplyData = await fetchOrCacheRoots(replyIds);

    const enrichedReplies = replyChain.map((reply) => {
      const detailedReply = detailedReplyData.find(
        (detailedReply) => detailedReply.id === reply.id,
      );
      return {
        ...reply,
        ...detailedReply,
        heartedByUser: reply.hearts.length > 0,
      };
    });

    res.status(200).json({
      replies: enrichedReplies,
      pagination: {
        nextPage: lastReplyId,
      },
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({ error: "Error fetching replies." });
  }
}
