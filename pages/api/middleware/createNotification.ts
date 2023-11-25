import { prisma } from "@/lib/global/prisma";

export async function createNotification(
  recepientId: string,
  activityId: string,
  aggregationKey: string,
): Promise<void> {
  await prisma.notification.create({
    data: {
      recipientId: recepientId,
      activityId: activityId,
      aggregation_Key: aggregationKey,
    },
  });
}

export async function deleteNotification(
  recepientId: string,
  activityId: string,
  aggregationKey: string,
): Promise<void> {
  await prisma.notification.deleteMany({
    where: {
      recipientId: recepientId,
      activityId: activityId,
      aggregation_Key: aggregationKey,
    },
  });
}
