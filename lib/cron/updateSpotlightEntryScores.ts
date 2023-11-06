// import client from "../global/redis";
// import { prisma } from "../global/prisma";
//
// interface PrismaReviewData {
//   id: string;
//   _count: {
//     replies: number;
//     hearts: number;
//   };
//   viewsCount: number;
// }
//
// // Weights for the trending score calculation
// const weights = {
//   views: 0.4,
//   hearts: 0.3,
//   replies: 0.3,
// };
//
// // Function to calculate the trending score
// function calculateSpotlightScore(record: PrismaReviewData) {
//   return (
//     record.viewsCount * weights.views +
//     record._count.hearts * weights.hearts +
//     record._count.replies * weights.replies
//   );
// }
//
// export async function updateSpotlightEntryScores() {
//   const entries = await prisma.review.findMany({
//     select: {
//       id: true,
//       _count: {
//         select: { replies: true, hearts: true },
//       },
//       viewsCount: true,
//     },
//   });
//
//   // Loop over each record and calculate the trending score
//   for (const record of entries) {
//     const trendingScore = calculateSpotlightScore(record);
//
//     // Update the record with the new trending score in Redis
//     await client.zadd("spotlightEntries", trendingScore, record.id);
//
//     console.log(
//       `Updated record ${JSON.stringify(
//         record
//       )} / with new spotlight score: ${trendingScore}`
//     );
//   }
//
//   console.log("FeedRecord spotlight scores updated successfully");
// }
