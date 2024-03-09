// import { ActivityType } from "@prisma/client";

// export function createKey(type: ActivityType, targetId: string): string {
//   let key: string;

//   switch (type) {
//     case ActivityType.heart:
//       key = `heart|${targetId}`;
//       break;
//     case ActivityType.followed_back:
//       key = `followed_back|${targetId}`;
//       break;
//     case ActivityType.followed:
//       key = `followed|${targetId}`;
//       break;
//     case ActivityType.reply:
//       key = `reply|${targetId}`;
//       break;
//     case ActivityType.artifact:
//       key = `artifact|${targetId}`;
//       break;
//     default:
//       throw new Error(`Unsupported activity type: ${type}`);
//   }

//   return key;
// }

// // //follow
// // const followType = isFollowingBtoA
// //   ? ActivityType.FOLLOWED_BACK
// //   : ActivityType.FOLLOWED;
// // const aggregationKey = `${followType}|${followerId}|${followingId}`;
// // //unfollow
// // const aggregationKey = `${followType}|${unfollowingId}|${unfollowerId}`;

export const runtime = "edge";
