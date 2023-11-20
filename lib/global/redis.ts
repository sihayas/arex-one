import Redis from "ioredis";

const client = new Redis(
  "redis://default:ce01f2aef8b74c88932b8e28d0dec717@us1-evolved-squirrel-39264.upstash.io:39264",
);

export default client;

// Set data in Redis cache
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
