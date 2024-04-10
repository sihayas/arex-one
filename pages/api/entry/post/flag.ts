// import { prisma } from "@/lib/global/prisma";

// export default async function onRequestPost(request: any) {
//   const data = await request.json();
//   const { referenceId, type, authorId } = data;

//   if (!referenceId || !type) {
//     return new Response(
//       JSON.stringify({
//         error: "Missing required fields: referenceId and type.",
//       }),
//       {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }

//   try {
//     const flag = await prisma.flag.create({
//       data: {
//         referenceId,
//         type,
//         flaggedById: authorId,
//       },
//     });

//     return new Response(JSON.stringify(flag), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error flagging content:", error);
//     return new Response(JSON.stringify({ error: "Failed to flag content." }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export const runtime = "edge";
