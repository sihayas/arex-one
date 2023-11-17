import Redis from "ioredis";

const client = new Redis(
  "redis://default:ce01f2aef8b74c88932b8e28d0dec717@us1-evolved-squirrel-39264.upstash.io:39264",
);

export default client;
