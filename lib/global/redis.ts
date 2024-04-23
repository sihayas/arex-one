import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// -- Redis Sound Keys --
// Key for mapping Apple Music ID to internal Sound ID
export const soundAppleToDbIdMap = () => `sound:apple_to_db:map`;

// Key for sound data in Redis.
export const soundDataKey = (soundId: string) => `sound:${soundId}:data`;

// -- Redis User Keys --
// User profile, a hash of user profile.
export const userProfileKey = (userId: string) => `user:${userId}:profile`;

// User feed, a sorted set of IDS.
export const userFeedKey = (userId: string) => `user:${userId}:feed`;

// User notifications, a sorted set of IDS.
export const userNotifsKey = (userId: string) => `user:${userId}:notifs`;

// User aggregated notifications, a sorted set of AGG_NOTIFS.
export const userAggNotifsKey = (userId: string) => `user:${userId}:agg_notifs`;

// User entries, a sorted set of IDS.
export const userEntriesKey = (userId: string) => `user:${userId}:entry_ids`;

// User hearts, a list of IDS.
export const userHeartsKey = (userId: string) => `user:${userId}:hearts`;

// User followers, a list of ids in Redis.
export const userFollowersKey = (userId: string) => `user:${userId}:followers`;

// Unread count, a NUMBER.
export const userUnreadNotifsCount = (userId: string) =>
  `user:${userId}:unread_count`;

// -- Redis Entry Keys --

// Heart count, a NUMBER.
export const entryHeartCountKey = (userId: string) =>
  `entry:${userId}:heart_count`;

// Key for entry data in Redis.
export const entryDataKey = (entryId: string) => `entry:${entryId}:data`;
