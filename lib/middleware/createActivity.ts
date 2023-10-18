import { prisma } from "../global/prisma";
import { ActivityType } from "@/types/dbTypes";

export async function createEntryRecordActivity(recordId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.RECORD,
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
