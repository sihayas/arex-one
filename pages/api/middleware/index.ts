// // Activities
// export async function createEntryActivity(artifactId: string) {
//   return prisma.activity.create({
//     data: {
//       type: ActivityType.artifact,
//       referenceId: artifactId,
//     },
//   });
// }
//
// export async function createHeartActivity(heartId: string) {
//   return prisma.activity.create({
//     data: {
//       type: ActivityType.heart,
//       referenceId: heartId,
//     },
//   });
// }
//
// export async function createReplyActivity(replyId: string) {
//   return prisma.activity.create({
//     data: {
//       type: ActivityType.reply,
//       referenceId: replyId,
//     },
//   });
// }
//
// // Key for notification grouping
// export function createKey(type: ActivityType, targetId: string): string {
//   let key: string;
//
//   switch (type) {
//     case ActivityType.heart:
//       key = `heart|${targetId}`;
//       break;
//     case ActivityType.follow:
//       key = `follow|${targetId}`;
//       break;
//     case ActivityType.reply:
//       key = `reply|${targetId}`;
//       break;
//     case ActivityType.entry:
//       key = `entry|${targetId}`;
//       break;
//     default:
//       throw new Error(`Unsupported activity type: ${type}`);
//   }
//
//   return key;
// }
//
// // Notifications
// export async function createNotification(
//   recepientId: string,
//   activityId: string,
//   key: string,
// ): Promise<void> {
//   await prisma.notification.create({
//     data: {
//       recipientId: recepientId,
//       activityId: activityId,
//       key,
//     },
//   });
// }

export const runtime = "edge";
