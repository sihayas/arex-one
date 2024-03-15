import { prisma } from "@/lib/global/prisma";
import { createReplyActivity } from "@/pages/api/mid/createActivity";
import { createNotification } from "@/pages/api/mid/createNotification";
import { createKey } from "@/pages/api/mid/createKey";
import { ActivityType } from "@prisma/client";
import { ReplyType } from "@/types/dbTypes";

type NewReplyBase = Pick<ReplyType, "id" | "authorId" | "replyToId">;

export default async function onRequestPost(request: any) {
  const {
    artifactId,
    artifactAuthorId,
    rootId,
    toReplyId,
    toReplyAuthorId,
    toReplyParentId,
    text,
    userId,
  } = await request.json();

  if (!userId || (!artifactId && !artifactAuthorId) || !text) {
    return new Response(
      JSON.stringify({ error: "Required parameters are missing." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const createdReply = await prisma.reply.create({
      data: {
        author: { connect: { id: userId } },
        text: text,
        artifact: { connect: { id: artifactId } },
        ...(toReplyId ? { replyTo: { connect: { id: toReplyId } } } : {}),
      },
    });

    const effectiveRootId = rootId || createdReply.id;

    const updatedReply = await prisma.reply.update({
      where: { id: createdReply.id },
      data: { root: { connect: { id: effectiveRootId } } },
    });

    const activity = await createReplyActivity(updatedReply.id);

    // If author is replying to their own artifact, don't notify them
    if (artifactAuthorId === userId && !toReplyId) {
      return new Response(JSON.stringify(updatedReply), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key = createKey(ActivityType.reply, updatedReply.id);
    // Notify the artifact author
    await createNotification(artifactAuthorId, activity.id, key);

    //Notify the reply author if reply to reply and not replying to self
    if (toReplyId && toReplyAuthorId !== userId) {
      await createNotification(toReplyAuthorId, activity.id, key);
      if (toReplyParentId) {
        await notifyReplyChain(toReplyParentId, userId, activity.id, key);
      }
    }

    return new Response(JSON.stringify(updatedReply), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    return new Response(JSON.stringify({ error: "Error adding reply." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Dangerous recursive function 0.0
async function notifyReplyChain(
  replyingToId: string,
  userId: string,
  activityId: string,
  key: string,
) {
  const notifiedUsers = new Set<string>();

  let currentReplyId: string | null = replyingToId;
  while (currentReplyId) {
    const reply = (await prisma.reply.findUnique({
      where: { id: currentReplyId },
      select: { id: true, authorId: true, replyToId: true },
    })) as NewReplyBase | null;

    if (!reply) break;

    // If already notified, skip. If replying to their own reply, skip
    if (!notifiedUsers.has(reply.authorId) && reply.authorId !== userId) {
      notifiedUsers.add(reply.authorId);
      await createNotification(reply.authorId, activityId, key);
    }

    currentReplyId = reply.replyToId ?? null;
  }
}

export const runtime = "edge";
