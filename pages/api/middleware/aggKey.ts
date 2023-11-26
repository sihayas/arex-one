import { ActivityType } from "@prisma/client";

export function createAggKey(
  type: ActivityType,
  targetId: string,
  userId: string,
): string {
  let aggregationKey: string;

  switch (type) {
    case ActivityType.HEART:
      aggregationKey = `HEART|${targetId}|${userId}`;
      break;
    case ActivityType.FOLLOWED_BACK:
      const unfollowingId = targetId;
      const unfollowerId = userId;
      aggregationKey = `FOLLOWED_BACK|${unfollowingId}|${unfollowerId}`;
      break;
    case ActivityType.FOLLOWED:
      const followingId = targetId;
      const followerId = userId;
      aggregationKey = `FOLLOWED|${followerId}|${followingId}`;
      break;
    case ActivityType.REPLY:
      aggregationKey = `REPLY|${targetId}|${userId}`;
      break;
    case ActivityType.RECORD:
      aggregationKey = `RECORD|${targetId}|${userId}`;
      break;
    default:
      throw new Error(`Unsupported activity type: ${type}`);
  }

  return aggregationKey;
}

// //follow
// const followType = isFollowingBtoA
//   ? ActivityType.FOLLOWED_BACK
//   : ActivityType.FOLLOWED;
// const aggregationKey = `${followType}|${followerId}|${followingId}`;
// //unfollow
// const aggregationKey = `${followType}|${unfollowingId}|${unfollowerId}`;
