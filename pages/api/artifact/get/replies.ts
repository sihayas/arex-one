// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/global/prisma";
// import { fetchOrCacheRoots } from "@/pages/api/cache/reply";

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed." });
//   }

//   const { artifactId, replyId } = req.query;
//   const userId =
//     typeof req.query.userId === "string" ? req.query.userId : undefined;

//   if (artifactId !== undefined && typeof artifactId !== "string") {
//     return res.status(400).json({ error: "Invalid artifact ID." });
//   }

//   if (replyId !== undefined && typeof replyId !== "string") {
//     return res.status(400).json({ error: "Invalid reply ID." });
//   }

//   const page = parseInt(req.query.page as string, 10) || 1;
//   const limit = parseInt(req.query.limit as string, 10) || 6;
//   const start = (page - 1) * limit;

//   try {
//     const whereClause = artifactId
//       ? { artifactId, replyToId: null }
//       : replyId
//         ? { replyToId: replyId }
//         : {};

//     const replies = await prisma.reply.findMany({
//       where: whereClause,
//       take: limit + 1,
//       skip: start,
//       orderBy: {
//         hearts: {
//           _count: "desc",
//         },
//       },
//       select: {
//         id: true,
//         hearts: { where: { authorId: userId } },
//         _count: { select: { replies: true, hearts: true } },
//         replyTo: {
//           select: { author: { select: { image: true } }, text: true, id: true },
//         },
//       },
//     });

//     if (!replies || replies.length === 0) {
//       return res.status(404).json({ error: "No replies found." });
//     }

//     const hasMorePages = replies.length > limit;
//     if (hasMorePages) replies.pop();

//     const replyIds = replies.map((reply) => reply.id);

//     const detailedReplyData = await fetchOrCacheRoots(replyIds);

//     const enrichedReplies = replies.map((reply) => {
//       const detailedReply = detailedReplyData.find(
//         (detailedReply) => detailedReply.id === reply.id,
//       );
//       return {
//         ...reply,
//         ...detailedReply,
//         heartedByUser: reply.hearts.length > 0,
//       };
//     });

//     return res.status(200).json({
//       data: {
//         replies: enrichedReplies,
//         pagination: { nextPage: hasMorePages ? page + 1 : null },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching replies:", error);
//     return res.status(500).json({ error: "Error fetching replies." });
//   }
// }

export const runtime = "edge";
