import { PrismaClient } from "@prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { Client } from "@planetscale/database";

export function prismaClient() {
  const env = process.env;

  const client = new Client({
    url: env.DATABASE_URL,
    fetch(url, init) {
      // @ts-ignore
      delete init["cache"];
      return fetch(url, init);
    },
  });
  const adapter = new PrismaPlanetScale(client);
  return new PrismaClient({ adapter: adapter });
}
