import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheRoots } from "@/pages/api/cache/reply";

export default async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const artifactId = url.searchParams.get("artifactId");
  const replyId = url.searchParams.get("replyId");
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "6", 10);
  const start = (page - 1) * limit;

  try {
    const whereClause = artifactId
      ? { artifactId, replyToId: null }
      : replyId
      ? { replyToId: replyId }
      : {};

    const replies = await prisma.reply.findMany({
      where: whereClause,
      take: limit + 1,
      skip: start,
      orderBy: {
        hearts: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        hearts: { where: { authorId: userId } },
        _count: { select: { replies: true, hearts: true } },
        replyTo: {
          select: { author: { select: { image: true } }, text: true, id: true },
        },
      },
    });

    if (!replies || replies.length === 0) {
      return new Response(JSON.stringify({ error: "No replies found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hasMorePages = replies.length > limit;
    if (hasMorePages) replies.pop();

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

    return new Response(
      JSON.stringify({
        data: {
          replies: enrichedReplies,
          pagination: { nextPage: hasMorePages ? page + 1 : null },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching replies:", error);
    return new Response(JSON.stringify({ error: "Error fetching replies." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
