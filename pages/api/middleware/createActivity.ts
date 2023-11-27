import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@/types/dbTypes";

export async function createArtifactEntryActivity(artifactId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.ENTRY,
      referenceId: artifactId,
    },
  });
}

export async function createHeartActivity(heartId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.HEART,
      referenceId: heartId,
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
  followType: ActivityType.FOLLOWED | ActivityType.FOLLOWED_BACK,
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
