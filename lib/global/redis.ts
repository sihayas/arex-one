import Redis from "ioredis";

const client = new Redis(
  "redis://default:ce01f2aef8b74c88932b8e28d0dec717@us1-evolved-squirrel-39264.upstash.io:39264",
);

export default client;

// Set data in Redis cache with an expiration time
export const setCache = async (
  key: string,
  value: any,
  ttl: number,
): Promise<void> => {
  await client.setex(key, ttl, JSON.stringify(value));
};

// Get data from Redis cache
export const getCache = async (key: string): Promise<any | null> => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
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
    const result = await client.eval(fetchAndClearScript, 1, setKey);

    if (Array.isArray(result)) {
      return result.map((id) => String(id));
    }

    throw new Error("Expected an array from Redis eval");
  } catch (error) {
    console.error("Error executing Lua script:", error);
    throw error;
  }
}
