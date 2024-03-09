// import { getCache, setCache } from "@/lib/global/redis";
// import { prisma } from "@/lib/global/prisma";
// import { Sound, UserType } from "@/types/dbTypes";
// import { Artifact as PrismaArtifact } from "@prisma/client";

// type AuthorData = Pick<UserType, "id">;

// type ArtifactType = PrismaArtifact["type"];

// type SoundData = Pick<Sound, "appleId">;

// type ArtifactData = {
//   type: ArtifactType;
//   content?: {
//     text: string;
//     rating: number | null;
//     loved: boolean | null;
//     replay: boolean | null;
//   } | null;
//   sound: SoundData;
//   author: AuthorData;
// };

// type ActivityData = {
//   id: string;
//   artifact?: ArtifactData | null;
// };

// async function fetchOrCacheActivities(ids: string[]): Promise<ActivityData[]> {
//   const activityData: Record<string, ActivityData> = {};
//   const idsToFetch: string[] = [];

//   // Initiate cache lookups in parallel for all activity IDs
//   const cachePromises = ids.map((id) =>
//     getCache(`activity:${id}:artifact:data`),
//   );
//   const cacheResults = await Promise.allSettled(cachePromises);

//   // Process cache results and identify IDs not in cache
//   cacheResults.forEach((result, index) => {
//     const id = ids[index];
//     if (result.status === "fulfilled" && result.value) {
//       activityData[id] = result.value;
//     } else {
//       idsToFetch.push(id);
//     }
//   });

//   // Fetch data from database for IDs not found in cache
//   if (idsToFetch.length > 0) {
//     const data = await prisma.activity.findMany({
//       where: { id: { in: idsToFetch }, isDeleted: false },
//       select: {
//         id: true,
//         artifact: {
//           select: {
//             id: true,
//             author: { select: { id: true, username: true, image: true } },
//             type: true,
//             content: {
//               select: { text: true, rating: true, loved: true, replay: true },
//             },
//             sound: { select: { appleId: true, type: true, id: true } },
//           },
//         },
//       },
//     });

//     const enrichArtifactData = data.map((activity) => {
//       // Set the activity to its corresponding ID in the activityData object
//       // const id = idsToFetch[data.indexOf(activity)];
//       activityData[activity.id] = activity;
//       // Cache the activity data
//       return setCache(`activity:${activity.id}:artifact:data`, activity, 3600);
//     });

//     await Promise.all(enrichArtifactData);
//   }

//   // Compile and return results
//   return ids.map((id) => activityData[id]);
// }

// export { fetchOrCacheActivities };

export const runtime = "edge";
