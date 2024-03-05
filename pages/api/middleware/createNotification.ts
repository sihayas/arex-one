import { prisma } from "@/lib/global/prisma";

export async function createNotification(
  recepientId: string,
  activityId: string,
  key: string,
): Promise<void> {
  await prisma.notification.create({
    data: {
      recipientId: recepientId,
      activityId: activityId,
      key,
    },
  });
}

// export const runtime = "edge";
