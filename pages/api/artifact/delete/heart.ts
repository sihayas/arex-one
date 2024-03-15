import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";

export default async function onRequestPost(request: any) {
  const { artifactId, userId, authorId } = await request.json();

  if (authorId === userId) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existingHeart = await prisma.heart.findFirst({
    where: { authorId: userId, artifactId },
  });

  if (!existingHeart) {
    return new Response(
      JSON.stringify({ success: false, message: "No heart found to unheart" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const existingActivity = await prisma.activity.findFirst({
    where: { type: ActivityType.heart, referenceId: existingHeart.id },
  });

  if (!existingActivity) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No activity found to un-heart",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const key = `heart|${artifactId}`;
  await prisma.$transaction([
    prisma.notification.deleteMany({
      where: {
        key,
        recipientId: authorId,
        activityId: existingActivity.id,
      },
    }),
    prisma.activity.delete({ where: { id: existingActivity.id } }),
    prisma.heart.delete({ where: { id: existingHeart.id } }),
  ]);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const runtime = "edge";
