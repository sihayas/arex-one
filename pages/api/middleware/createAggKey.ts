import { ActivityType } from "@prisma/client";

export function createAggKey(
  type: ActivityType,
  targetId: string,
  userId: string,
): string {
  let aggregationKey: string;

  switch (type) {
    case ActivityType.heart:
      aggregationKey = `heart|${targetId}|${userId}`;
      break;
    case ActivityType.followed_back:
      const unfollowingId = targetId;
      const unfollowerId = userId;
      aggregationKey = `followed_back|${unfollowingId}|${unfollowerId}`;
      break;
    case ActivityType.followed:
      const followingId = targetId;
      const followerId = userId;
      aggregationKey = `followed|${followerId}|${followingId}`;
      break;
    case ActivityType.reply:
      aggregationKey = `reply|${targetId}|${userId}`;
      break;
    case ActivityType.artifact:
      aggregationKey = `artifact|${targetId}|${userId}`;
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
