import { prisma } from "@/lib/global/prisma";
import { ActivityType } from "@prisma/client";

export async function createArtifactActivity(artifactId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.artifact,
      referenceId: artifactId,
    },
  });
}

export async function createHeartActivity(heartId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.heart,
      referenceId: heartId,
    },
  });
}

export async function createReplyRecordActivity(replyId: string) {
  return prisma.activity.create({
    data: {
      type: ActivityType.reply,
      referenceId: replyId,
    },
  });
}

export async function createFollowActivity(
  followId: string,
  followType: "followed" | "followed_back",
) {
  return prisma.activity.create({
    data: {
      type: ActivityType[followType],
      referenceId: followId,
    },
  });
}
