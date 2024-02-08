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
  const replyChain = [];

  let currentReplyId = cursor || replyId;
  let cursorId = null;

  try {
    while (replyChain.length < ancestorLimit) {
      const reply = await prisma.reply.findUnique({
        where: { id: currentReplyId },
        select: {
          id: true,
          hearts: { where: { authorId: userId } },
          _count: { select: { replies: true, hearts: true } },
          replyTo: {
            select: {
              author: { select: { image: true } },
              text: true,
              id: true,
            },
          },
        },
      });

      if (!reply) {
        break;
      }
      replyChain.push(reply); // Push the reply to the chain

      if (!reply.replyTo) {
        break; // Stop the loop if reply has no replyTo
      }

      currentReplyId = reply.replyTo.id; // Update current reply to the parent
      cursorId = reply.replyTo.id;
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
        //@ts-ignore
        heartedByUser: reply.hearts.length > 0,
      };
    });

    res.status(200).json({
      replies: enrichedReplies,
      pagination: {
        nextPage: cursorId,
      },
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({ error: "Error fetching replies." });
  }
}
