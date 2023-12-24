import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createReplyActivity } from "@/pages/api/middleware/createActivity";
import { createNotification } from "@/pages/api/middleware/createNotification";
import { createKey } from "@/pages/api/middleware/createKey";
import { ActivityType } from "@prisma/client";
import { ReplyType } from "@/types/dbTypes";

type NewReplyBase = Pick<ReplyType, "id" | "authorId" | "replyToId">;

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
      const key = createKey(ActivityType.reply, reply.id);
      await createNotification(reply.authorId, activityId, key);
    }

    currentReplyId = reply.replyToId ?? null;
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const {
    artifactId,
    artifactAuthorId,
    replyingToId,
    replyingToReplyId,
    rootId,
    text,
    userId,
  } = req.body;

  if (!userId || (!artifactId && !artifactAuthorId) || !text) {
    return res.status(400).json({ error: "Required parameters are missing." });
  }

  console.log("req.body", req.body);

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
    const key = createKey(ActivityType.reply, createdReply.id);
    await createNotification(artifactAuthorId, activity.id, key);

    // Notify the replyParent's
    if (replyingToId) {
      //Notify the first reply ancestor
      const key = createKey(ActivityType.reply, createdReply.id);
      await createNotification(replyingToId, activity.id, key);
      // Notify the second reply ancestor
      if (replyingToReplyId) {
        const key = createKey(ActivityType.reply, createdReply.id);
        await createNotification(replyingToReplyId, activity.id, key);
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
