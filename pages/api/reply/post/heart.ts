import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";
import { createHeartActivity } from "@/pages/api/mid/createActivity";
import { createKey } from "@/pages/api/mid/createKey";

type Data = {
  success: boolean;
  message: string;
};

export default async function onRequestPost(request: any) {
  const { replyId, userId, authorId } = await request.json();

  if (
    authorId === userId ||
    (await prisma.heart.findFirst({ where: { authorId: userId, replyId } }))
  ) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid heart operation" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const newHeart = await prisma.heart.create({
    data: { authorId: userId, replyId },
  });

  const activity = await createHeartActivity(newHeart.id);

  const key = createKey("heart", replyId);

  await prisma.notification.create({
    data: {
      key: key,
      recipientId: authorId,
      activityId: activity.id,
    },
  });

  return new Response(
    JSON.stringify({ success: true, message: "Hearted successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
