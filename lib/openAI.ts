// import { prisma } from "@/lib/prisma";
// import { ReviewData } from "./interfaces";
// import axios from "axios";

// const INITIAL_REVIEW_THRESHOLD = 2;
// const REVIEW_DIFFERENCE_THRESHOLD = 1000;

// // Generate the consensus
// async function getConsensusFromOpenAI(reviews: ReviewData[]): Promise<string> {
//   const endpoint = "https://api.openai.com/v1/chat/completions"; // Change if OpenAI's endpoint changes
//   const prompt = ` Given these reviews for an album froma a music erview site: ${reviews
//     .map((r) => r.content)
//     .join(
//       ", "
//     )}, write a summary that encapsulates the overall consensus for the album.`;

//   const response = await axios.post(
//     endpoint,
//     {
//       prompt: prompt,
//       max_tokens: 150, // Limit the response length
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   console.log(response.data);
//   return response.data.choices[0].text.trim();
// }

// // Helper: Determines whether to generate consensus or not.
// async function shouldGenerateConsensus(
//   albumId: string,
//   newReviewCount: number
// ): Promise<boolean> {
//   const album = await prisma.album.findUnique({
//     where: { id: albumId },
//     select: { reviewsCount: true },
//   });
//   //
//   //   if (album && album.reviewsCount === 0) {
//   //     return newReviewCount >= INITIAL_REVIEW_THRESHOLD;
//   //   }

//   if (album) {
//     // If the review count has increased by a significant margin since the last consensus,
//     // generate a new one. This margin can be tweaked as per your requirement.
//     if (newReviewCount - album.reviewsCount >= REVIEW_DIFFERENCE_THRESHOLD) {
//       return true;
//     }
//   }

//   return false;
// }

// // // Sends reviews to open AI and store consensus response.
// // async function handleConsensusForAlbum(albumId: string) {
// //   // Count reviews for album
// //   const newReviewCount = await prisma.review.count({
// //     where: { albumId: albumId },
// //   });
// //   // If eligible to update consensus, send to OpenAI
// //   if (await shouldGenerateConsensus(albumId, newReviewCount)) {
// //     const reviews = await prisma.review.findMany({
// //       where: { albumId: albumId },
// //       select: { content: true },
// //     });
// //     // Send reviews to Open AI
// //     const consensus = await getConsensusFromOpenAI(reviews);
// //
// //     await prisma.album.update({
// //       where: { id: albumId },
// //       data: {
// //         notes: consensus,
// //         reviewsCount: newReviewCount,
// //       },
// //     });
// //
// //     console.log(
// //       `Updated album ${albumId} with the following consensus, ${consensus}`
// //     );
// //   }
// // }

// // Sends reviews to open AI and store consensus response.
// async function handleConsensusForAlbum(albumId: string) {
//   // If eligible to update consensus, send to OpenAI
//   const reviews = await prisma.review.findMany({
//     where: { albumId: albumId },
//     select: { content: true },
//   });
//   // Send reviews to Open AI
//   const consensus = await getConsensusFromOpenAI(reviews);

//   await prisma.album.update({
//     where: { id: albumId },
//     data: {
//       notes: consensus,
//     },
//   });

//   console.log(
//     `Updated album ${albumId} with the following consensus, ${consensus}`
//   );
// }

// export async function generateConsensusForAlbums() {
//   // Fetch all albums.
//   // If you want to restrict this to only recently updated albums,
//   // you can use the getRecentlyUpdatedAlbums function.
//   const albums = await prisma.album.findMany();

//   for (const album of albums) {
//     await handleConsensusForAlbum(album.id);
//   }

//   console.log("Consensus generation completed.");
// }
