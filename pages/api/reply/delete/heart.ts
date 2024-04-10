// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/global/prisma";
// import { ActivityType } from "@prisma/client";

// type Data = {
//   success: boolean;
// };

// export default async function onRequestPost(request: any) {
//   const { replyId, userId, authorId } = await request.json();

//   const existingHeart = await prisma.heart.findFirst({
//     where: {
//       authorId: userId,
//       replyId,
//       isDeleted: false,
//     },
//   });

//   if (existingHeart) {
//     const existingActivity = await prisma.activity.findFirst({
//       where: {
//         type: ActivityType.heart,
//         referenceId: existingHeart.id,
//       },
//     });

//     if (existingActivity) {
//       // Delete all notifications related to this activity
//       const key = `heart|${replyId}`;
//       await prisma.notification.updateMany({
//         where: {
//           key,
//           recipientId: authorId,
//           activityId: existingActivity.id,
//         },
//         data: {
//           isDeleted: true,
//         },
//       });

//       await prisma.activity.update({
//         where: { id: existingActivity.id },
//         data: {
//           isDeleted: true,
//         },
//       });
//     }

//     await prisma.heart.update({
//       where: { id: existingHeart.id },
//       data: {
//         isDeleted: true,
//       },
//     });
//   }

//   return new Response(JSON.stringify({ success: true }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }

export const runtime = "edge";
