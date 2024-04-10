import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
}

export function prismaClient(env: Env) {
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter: adapter });
}
