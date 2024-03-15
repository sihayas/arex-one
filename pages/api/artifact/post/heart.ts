import { prisma } from "@/lib/global/prisma";
import { createHeartActivity } from "@/pages/api/mid/createActivity";
import { createKey } from "@/pages/api/mid/createKey";

export default async function onRequestPost(request: any) {
  const data = await request.json();
  const { artifactId, userId, authorId } = data;

  if (authorId === userId) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid heart operation" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const existingHeart = await prisma.heart.findFirst({
      where: { authorId: userId, artifactId },
    });
    if (existingHeart) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid heart operation" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const newHeart = await prisma.heart.create({
      data: { authorId: userId, artifactId },
    });

    const activity = await createHeartActivity(newHeart.id);

    const key = createKey("heart", artifactId);

    await prisma.notification.create({
      data: {
        recipientId: authorId,
        activityId: activity.id,
        key: key,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating heart:", error);
    return new Response(JSON.stringify({ error: "Failed to create heart." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
