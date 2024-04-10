// import { prisma } from "@/lib/global/prisma";
// import { cacheEntries } from "../../cache/entries";

export const runtime = "edge";

// export default async function onRequestGet(request: any) {
//   const url = new URL(request.url);
//   const soundId = url.searchParams.get("soundId");
//   const userId = url.searchParams.get("userId");

//   const sort = url.searchParams.get("sort") || "newest";
//   const rangeParam = url.searchParams.get("range");
//   const range = rangeParam ? rangeParam : undefined;

//   const page = parseInt(url.searchParams.get("page") || "1", 10);
//   const limit = parseInt(url.searchParams.get("limit") || "6", 10);
//   const start = (page - 1) * limit;

//   if (!soundId || !userId) {
//     return new Response(
//       JSON.stringify({ error: "Sound ID and User ID are required." }),
//       {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }

//   try {
//     let hasMorePages = false;

//     const artifacts = await prisma.artifact.findMany({
//       where: {
//         type: "entry",
//         sound: { appleId: soundId },
//         ...(range !== undefined && {
//           content: {
//             rating: {
//               gte: parseInt(range, 10) + 0.5,
//               lt: parseInt(range, 10) + 1.5,
//             },
//           },
//         }),
//       },
//       orderBy: { createdAt: "desc" },
//       skip: start,
//       take: limit + 1,
//       select: {
//         id: true,
//         hearts: { where: { authorId: userId } },
//         _count: { select: { replies: true, hearts: true } },
//       },
//     });

//     hasMorePages = artifacts.length > limit;
//     if (hasMorePages) artifacts.pop();

//     const detailedArtifacts = await cacheEntries(
//       artifacts.map((artifact) => artifact.id),
//     );

//     const enrichedArtifacts = artifacts.map((artifact, index) => {
//       const detailedData = detailedArtifacts[index];
//       return {
//         artifact: {
//           ...artifact,
//           ...(detailedData ?? {}),
//           heartedByUser: (artifact?.hearts?.length ?? 0) > 0,
//         },
//       };
//     });

//     return new Response(
//       JSON.stringify({
//         data: {
//           artifacts: enrichedArtifacts,
//           pagination: { nextPage: hasMorePages ? page + 1 : null },
//         },
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return new Response(JSON.stringify({ error: "Error fetching reviews." }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
