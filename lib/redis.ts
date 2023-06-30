import Redis from "ioredis";

const client = new Redis(
  "rediss://default:84d612f0fd4740ed9b53cdb2368be8fb@stable-emu-38672.upstash.io:38672"
);

export default client;
