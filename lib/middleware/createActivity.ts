import { prisma } from "../global/prisma";

export async function createEntryRecordActivity(recordId: string) {
  return prisma.activity.create({
    data: {
      type: "RECORD",
      referenceId: recordId,
    },
  });
}

// export async function createLikeActivity(likeId: string) {
//   return await prisma.activity.create({
//     data: {
//       type: "Like",
//       likeId,
//     },
//   });
// }
