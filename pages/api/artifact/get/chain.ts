import { prisma } from "@/lib/global/prisma";
import { fetchOrCacheRoots } from "@/pages/api/cache/reply";

export async function onRequestGet(request: any) {
  const url = new URL(request.url);
  const replyId = url.searchParams.get("replyId");
  const userId = url.searchParams.get("userId");
  let cursor = url.searchParams.get("cursor");

  if (!replyId) {
    return new Response(JSON.stringify({ error: "Invalid reply ID." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Invalid user ID." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Optionally validate cursor if it's provided
  // if (cursor !== null) {
  //   return new Response(JSON.stringify({ error: "Invalid cursor." }), {
  //     status: 400,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

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
      replyChain.push(reply);

      if (!reply.replyTo) {
        cursorId = null;
        break;
      }

      currentReplyId = reply.replyTo.id; // Update current reply to the parent
      cursorId = reply.replyTo.id;
    }

    if (!replyChain || replyChain.length === 0) {
      return new Response(JSON.stringify({ error: "No replies found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
        heartedByUser: reply.hearts.length > 0, //@ts-ignore
      };
    });

    return new Response(
      JSON.stringify({
        replies: enrichedReplies,
        pagination: {
          nextPage: cursorId,
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
