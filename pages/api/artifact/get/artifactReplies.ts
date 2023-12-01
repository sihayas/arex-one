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
      // order by hearts count
      orderBy: {
        hearts: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        hearts: { where: { authorId: userId } },
        _count: { select: { replies: true, hearts: true } },
        replies: { select: { author: { select: { image: true } } }, take: 3 },
      },
    });

    if (!replies) {
      return res.status(404).json({ error: "No replies found." });
    }

    const replyIds = replies.map((reply) => reply.id);

    const detailedReplyData = await fetchOrCacheRoots(replyIds);

    const enrichedReplies = replies.map((reply) => {
      const detailedReply = detailedReplyData.find(
        (detailedReply) => detailedReply.id === reply.id,
      );
      return {
        ...reply,
        ...detailedReply,
        heartedByUser: reply.hearts.length > 0,
      };
    });

    return res.status(200).json(enrichedReplies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({ error: "Error fetching replies." });
  }
}
