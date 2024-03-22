import { prisma } from "@/lib/global/prisma";

export default async function onRequestDelete(request: any) {
  try {
    const { userId, authorId } = await request.json();

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
    });

    if (!existingFollow) {
      throw new Error("Follow relationship does not exist.");
    }

    // Mark the follow relationship as deleted
    await prisma.$transaction([
      prisma.follows.update({
        where: { id: existingFollow.id },
        data: { isDeleted: true },
      }),
      prisma.activity.update({
        where: { id: existingFollow.activityId },
        data: { isDeleted: true },
      }),
      prisma.notification.updateMany({
        where: { activityId: existingFollow.activityId, isDeleted: false },
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
