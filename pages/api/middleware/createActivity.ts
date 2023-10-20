import { prisma } from "../../../lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";

export async function createEntryRecordActivity(recordId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.RECORD,
      referenceId: recordId,
    },
  });
}

export async function createLikeRecordActivity(likeId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.LIKE,
      referenceId: likeId,
    },
  });
}

export async function createReplyRecordActivity(replyId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.REPLY,
      referenceId: replyId,
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
