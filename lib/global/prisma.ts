import { PrismaClient } from "@prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { Client } from "@planetscale/database";

export function initializePrisma() {
  const env = process.env;

  const client = new Client({ url: env.DATABASE_URL });
  const adapter = new PrismaPlanetScale(client);
  const prisma = new PrismaClient({ adapter: adapter });

  return prisma;
}
