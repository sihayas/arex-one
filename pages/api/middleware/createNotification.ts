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

export async function deleteNotification(
  recepientId: string,
  activityId: string,
  key: string,
): Promise<void> {
  await prisma.notification.deleteMany({
    where: {
      recipientId: recepientId,
      activityId: activityId,
      key: key,
    },
  });
}
