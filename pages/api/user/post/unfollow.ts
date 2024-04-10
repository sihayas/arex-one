// import { prisma } from "@/lib/global/prisma";
// import { fetchOrCacheUserFollowers } from "@/pages/api/cache/user";
// import { setCache } from "@/lib/global/redis";

export const runtime = "edge";

// export default async function onRequestPost(request: any) {
//   try {
//     const { userId, pageUserId } = await request.json();

//     if (userId === pageUserId) {
//       throw new Error("You cannot unfollow yourself.");
//     }

//     const existingFollow = await prisma.follows.findUnique({
//       where: {
//         followerId_followingId: {
//           followerId: userId,
//           followingId: pageUserId,
//         },
//         isDeleted: false,
//       },
//       include: {
//         activities: true,
//       },
//     });

//     if (!existingFollow || !existingFollow.activities.length) {
//       throw new Error("Follow relationship does not exist.");
//     }

//     console.log("Existing follow", existingFollow);

//     const activityId = existingFollow.activities[0].id;

//     // Mark the follow relationship in the database as deleted
//     await prisma.$transaction([
//       prisma.follows.update({
//         where: { id: existingFollow.id },
//         data: { isDeleted: true },
//       }),
//       prisma.activity.update({
//         where: { id: activityId },
//         data: { isDeleted: true },
//       }),
//       prisma.notification.updateMany({
//         where: { activityId, isDeleted: false },
//         data: { isDeleted: true },
//       }),
//     ]);

//     // Update the user's followers cache
//     const userFollowers = await fetchOrCacheUserFollowers(pageUserId);
//     const updatedUserFollowers = userFollowers.filter(
//       (id: string) => id !== userId,
//     );
//     await setCache(
//       `user:${pageUserId}:followers`,
//       JSON.stringify(updatedUserFollowers),
//       3600,
//     );

//     return new Response(
//       JSON.stringify({ success: true, message: "Unfollowed successfully" }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   } catch (error) {
//     console.error("Unfollow error.", error);
//     return new Response(JSON.stringify({ error: "Unfollow error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
