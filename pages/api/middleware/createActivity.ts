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

export async function createFollowActivity(
  followId: string,
  followType: ActivityType.FOLLOWED | ActivityType.FOLLOWED_BACK
) {
  return prisma.activity.create({
    data: {
      type: followType,
      referenceId: followId,
    },
  });
}

export async function deleteActivity(activityId: string) {
  return prisma.activity.delete({
    where: {
      id: activityId,
    },
  });
}
