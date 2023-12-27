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

    if (!notifiedUsers.has(reply.authorId) && reply.authorId !== userId) {
      notifiedUsers.add(reply.authorId);
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
    rootId,
    toReplyId,
    toReplyAuthorId,
    toReplyParentId,
    text,
    userId,
  } = req.body;

  console.log("req.body", req.body);
  if (!userId || (!artifactId && !artifactAuthorId) || !text) {
    return res.status(400).json({ error: "Required parameters are missing." });
  }

  try {
    // Step 1: Create the reply
    const createdReply = await prisma.reply.create({
      data: {
        author: { connect: { id: userId } },
        text: text,
        artifact: { connect: { id: artifactId } },
        ...(toReplyId && {
          replyTo: { connect: { id: toReplyId } },
        }),
      },
    });

    const effectiveRootId = rootId || createdReply.id;

    const updatedReply = await prisma.reply.update({
      where: { id: createdReply.id },
      data: {
        root: { connect: { id: effectiveRootId } },
      },
    });

    const activity = await createReplyActivity(updatedReply.id);

    // If author is replying to their own artifact, don't notify them
    if (artifactAuthorId === userId && !toReplyId) {
      return res.status(200).json(updatedReply);
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

    res.status(200).json(createdReply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Error adding reply." });
  }
}
