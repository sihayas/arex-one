import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// -- Redis Sound Keys --

// Key for mapping Apple Music ID to internal Sound ID
export const soundDbToAppleIdMap = () => `sound:db_to_apple:map`;

export const soundAppleToDbIdMap = () => `sound:apple_to_db:map`;

// Key for sound data in Redis.
export const soundDataKey = (soundId: string) => `sound:${soundId}:data`;

// Key for sound entry ids in Redis.
export const soundEntriesKey = (soundId: string) =>
  `sound:${soundId}:entry_ids`;

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
export const userEntriesKey = (userId: string) => `user:${userId}:entries`;

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

// Set data in Redis cache with an expiration time
export const setCache = async (
  key: string,
  value: any,
  ttl: number,
): Promise<void> => {
  await redis.setex(key, ttl, value);
};

// Get data from Redis cache
export const getCache = async (key: string): Promise<any | null> => {
  const data = await redis.get(key);
  // @ts-ignore
  return data ? data : null;
};

// Utility function to fetch and clear the set atomically
export async function fetchAndClearUpdateSet(
  setKey: string,
): Promise<string[]> {
  const fetchAndClearScript = `
    local ids = redis.call('SMEMBERS', KEYS[1])
    redis.call('DEL', KEYS[1])
    return ids
  `;

  try {
    // @ts-ignore
    const result = await redis.eval(fetchAndClearScript, 1, setKey);

    if (Array.isArray(result)) {
      return result.map((id) => String(id));
    }

    throw new Error("Expected an array from Redis eval");
  } catch (error) {
    console.error("Error executing Lua script:", error);
    throw error;
  }
}
