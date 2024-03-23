import { prisma } from "@/lib/global/prisma";

export const runtime = "edge";

export default async function onRequestDelete(request: any) {
  try {
    const { authorId, userId } = await request.json();

    if (authorId === userId) {
      throw new Error("You cannot unfollow yourself.");
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: authorId,
          followingId: userId,
        },
        isDeleted: false,
      },
      include: {
        activities: true, // Eagerly load the related Activity records
      },
    });

    if (!existingFollow || !existingFollow.activities.length) {
      throw new Error("Follow relationship does not exist.");
    }

    const activityId = existingFollow.activities[0].id;

    // Mark the follow relationship as deleted
    await prisma.$transaction([
      prisma.follows.update({
        where: { id: existingFollow.id },
        data: { isDeleted: true },
      }),
      prisma.activity.update({
        where: { id: activityId },
        data: { isDeleted: true },
      }),
      prisma.notification.updateMany({
        where: { activityId, isDeleted: false },
        data: { isDeleted: true },
      }),
    ]);

    return new Response(
      JSON.stringify({ success: true, message: "Unfollowed successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unfollow error.", error);
    return new Response(JSON.stringify({ error: "Unfollow error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
