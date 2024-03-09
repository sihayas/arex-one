// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/global/prisma";
// import { fetchOrCacheArtifacts } from "../../cache/artifact";

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "GET") {
//     return res.status(400).json({ error: "Invalid request method." });
//   }

//   const soundId = Array.isArray(req.query.soundId)
//     ? req.query.soundId.join(",")
//     : req.query.soundId;
//   const range = Array.isArray(req.query.range)
//     ? req.query.range[0]
//     : req.query.range;
//   const userId = req.query.userId;

//   if (!soundId || typeof userId !== "string") {
//     return res
//       .status(400)
//       .json({ error: "Sound ID and User ID are required." });
//   }

//   const sort = req.query.sort || "newest";
//   const page = parseInt(req.query.page as string, 10) || 1;
//   const limit = parseInt(req.query.limit as string, 10) || 6;
//   const start = (page - 1) * limit;

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

//     // Cache/fetch artifacts
//     const artifactIds = artifacts.map((artifact) => artifact.id);
//     const detailedArtifacts = await fetchOrCacheArtifacts(artifactIds);

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

//     return res.status(200).json({
//       data: {
//         artifacts: enrichedArtifacts,
//         pagination: { nextPage: hasMorePages ? page + 1 : null },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ error: "Error fetching reviews." });
//   }
// }

export const runtime = "edge";
