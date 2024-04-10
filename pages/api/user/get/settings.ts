// import { prisma } from "@/lib/global/prisma";

// export default async function onRequestGet(request: any) {
//   const url = new URL(request.url);
//   const userId = url.searchParams.get("userId");

//   if (!userId) {
//     return new Response("User ID is required.", {
//       status: 400,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }

//   try {
//     const settings = await prisma.settings.findUnique({
//       where: { userId: userId },
//     });

//     if (!settings) {
//       return new Response("Settings not found for this user", {
//         status: 404,
//         headers: { "Content-Type": "text/plain" },
//       });
//     }

//     return new Response(JSON.stringify(settings), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching settings:", error);
//     return new Response("Error fetching settings.", {
//       status: 500,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }
// }

export const runtime = "edge";
