// import client from "../global/redis";
// import { prisma } from "../global/prisma";
// import { ReviewData } from "../../types/interfaces";
//
// interface PrismaReviewData {
//   id: string;
//   _count: {
//     replies: number;
//     hearts: number;
//   };
//   viewsCount: number;
//   updatedAt: Date;
// }
//
// // Weights for the trending score calculation
// const weights = {
//   views: 0.3,
//   hearts: 0.2,
//   replies: 0.2,
//   recency: 0.3, // <-- Add this
// };
//
// function calculateBloomingScore(record: PrismaReviewData) {
//   const currentTime = new Date();
//   const lastInteractionTime = new Date(record.updatedAt);
//   const diffInMilliseconds =
//     currentTime.getTime() - lastInteractionTime.getTime();
//   const diffInHours = diffInMilliseconds / 1000 / 60 / 60;
//
//   const recencyScore = 1 / (diffInHours + 1); // calculate recency score
//
//   return (
//     record.viewsCount * weights.views +
//     record._count.hearts * weights.hearts +
//     record._count.replies * weights.replies +
//     recencyScore * weights.recency
//   );
// }
//
// export async function updateBloomingEntryScores() {
//   const entries = await prisma.review.findMany({
//     select: {
//       id: true,
//       _count: {
//         select: { replies: true, hearts: true },
//       },
//       viewsCount: true,
//       updatedAt: true,
//     },
//   });
//
//   for (const record of entries) {
//     const bloomingScore = calculateBloomingScore(record);
//
//     await client.zadd("bloomingEntries", bloomingScore, record.id);
//
//     console.log(
//       `Updated record ${record.id} /  with new trending score: ${bloomingScore}`
//     );
//   }
//
//   console.log("FeedRecord blooming scores updated successfully");
// }
