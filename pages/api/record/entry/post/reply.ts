import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { createReplyRecordActivity } from "@/pages/api/middleware/createActivity";
import { createNotification } from "@/pages/api/middleware/createNotification";
import { createAggKey } from "@/pages/api/middleware/aggKey";
import { ActivityType } from "@/types/dbTypes";

// Notify all users in the reply chain
async function notifyReplyChain(
  replyId: string,
  userId: string,
  activityId: string,
) {
  const notifiedUsers = new Set();
  let currentReply = await prisma.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, replyToId: true },
  });

  while (currentReply) {
    const { authorId, replyToId } = currentReply;
    if (!notifiedUsers.has(authorId) && authorId !== userId) {
      notifiedUsers.add(authorId);

      const aggKey = createAggKey(ActivityType.REPLY, replyId, authorId);

      await createNotification(authorId, activityId, aggKey);
    }
    currentReply = replyToId
      ? await prisma.reply.findUnique({
          where: { id: replyToId },
          select: { authorId: true, replyToId: true },
        })
      : null;
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { recordAuthorId, recordId, replyId, content, userId } = req.body;
  let rootReplyId = req.body.rootReplyId;

  if (req.method !== "POST" || !userId || (!recordId && !replyId) || !content) {
    return res.status(req.method !== "POST" ? 405 : 400).json({
      error:
        req.method !== "POST"
          ? "Method not allowed."
          : "Review ID or Reply ID and content are required.",
    });
  }

  try {
    const newReply = {
      author: { connect: { id: userId } },
      record: { connect: { id: recordId } },
      replyTo: replyId ? { connect: { id: replyId } } : undefined,
      content,
    };

    const createdReply = await prisma.reply.create({ data: newReply });

    rootReplyId = rootReplyId || createdReply.id;
    await prisma.reply.update({
      where: { id: createdReply.id },
      data: { rootReply: { connect: { id: rootReplyId } } },
    });

    const aggKey = createAggKey(ActivityType.REPLY, createdReply.id, userId);

    const activity = await createReplyRecordActivity(createdReply.id);

    await createNotification(recordAuthorId, activity.id, aggKey);

    await notifyReplyChain(createdReply.id, userId, activity.id);

    res.status(200).json(createdReply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Error adding reply." });
  }
}
