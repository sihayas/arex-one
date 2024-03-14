import { Redis } from "@upstash/redis/cloudflare";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

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
