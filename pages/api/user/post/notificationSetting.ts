// import { prisma } from "@/lib/global/prisma";

export const runtime = "edge";

// export default async function onRequestPost(request: any) {
//   try {
//     const { userId, settingType, value } = await request.json();

//     if (
//       !userId ||
//       typeof settingType !== "string" ||
//       typeof value !== "boolean"
//     ) {
//       return new Response(
//         JSON.stringify({ error: "Invalid request parameters" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//     }

//     const validSettings = [
//       "heartNotifications",
//       "followNotifications",
//       "replyNotifications",
//     ];

//     if (!validSettings.includes(settingType)) {
//       return new Response(JSON.stringify({ error: "Invalid setting type" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const updatedSettings = await prisma.settings.update({
//       where: { userId },
//       data: { [settingType]: value },
//     });

//     // Respond with success
//     return new Response(JSON.stringify({ success: true, updatedSettings }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error updating notification settings.", error);
//     return new Response(
//       JSON.stringify({ error: "Error updating notification settings" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// }
