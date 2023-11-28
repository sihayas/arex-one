import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createReplyActivity } from "@/pages/api/middleware/createActivity";
import { createNotification } from "@/pages/api/middleware/createNotification";
import { createAggKey } from "@/pages/api/middleware/aggKey";
import { ActivityType } from "@prisma/client";
import { Reply } from "@/types/dbTypes";

type NewReplyBase = Pick<Reply, "id" | "authorId" | "replyToId">;

async function notifyReplyChain(
  replyingToId: string,
  userId: string,
  activityId: string,
) {
  const notifiedUsers = new Set<string>();

  let currentReplyId: string | null = replyingToId;
  while (currentReplyId) {
    const reply = (await prisma.reply.findUnique({
      where: { id: currentReplyId },
      select: { id: true, authorId: true, replyToId: true },
    })) as NewReplyBase | null;

    if (!reply) break;

    if (!notifiedUsers.has(reply.authorId) && reply.authorId !== userId) {
      notifiedUsers.add(reply.authorId);
      const aggKey = createAggKey(ActivityType.reply, reply.id, reply.authorId);
      await createNotification(reply.authorId, activityId, aggKey);
    }

    currentReplyId = reply.replyToId ?? null;
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    artifactId,
    artifactAuthorId,
    replyingToId,
    replyingToReplyId,
    rootId,
    text,
    userId,
  } = req.body;

  if (
    req.method !== "POST" ||
    !userId ||
    (!artifactId && !artifactAuthorId) ||
    !text
  ) {
    return res.status(req.method !== "POST" ? 405 : 400).json({
      error:
        req.method !== "POST"
          ? "Method not allowed."
          : "Review ID or Reply ID and content are required.",
    });
  }

  try {
    const newReplyData = {
      author: { connect: { id: userId } },
      text: text,
      artifact: { connect: { id: artifactId } },
      ...(rootId && { root: { connect: { id: rootId } } }),
      ...(replyingToId && { replyTo: { connect: { id: replyingToId } } }),
    };

    const createdReply = await prisma.reply.create({ data: newReplyData });
    const activity = await createReplyActivity(createdReply.id);

    // Notify the artifact author
    const aggKey = createAggKey(ActivityType.reply, createdReply.id, userId);
    await createNotification(artifactAuthorId, activity.id, aggKey);

    // Notify the replyParent's
    if (replyingToId) {
      //Notify the first reply ancestor
      const aggKey = createAggKey(
        ActivityType.reply,
        createdReply.id,
        replyingToId,
      );
      await createNotification(replyingToId, activity.id, aggKey);
      // Notify the second reply ancestor
      if (replyingToReplyId) {
        const aggKey = createAggKey(
          ActivityType.reply,
          createdReply.id,
          replyingToReplyId,
        );
        await createNotification(replyingToReplyId, activity.id, aggKey);
        // Check if there's more replies in the chain
        await notifyReplyChain(replyingToReplyId, userId, activity.id);
      }
    }
    res.status(200).json(createdReply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Error adding reply." });
  }
}
