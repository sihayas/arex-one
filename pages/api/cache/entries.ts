import { getCache, setCache } from "@/lib/global/redis";
import { UserType } from "@/types/dbTypes";
import { Entry as PrismaEntry, PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";

type AuthorData = Pick<UserType, "id">;

type EntryType = PrismaEntry["type"];

type EntryData = {
  author: AuthorData;
  id: string;
  type: EntryType;
  text: string | null;
  rating: number | null;
  loved: boolean | null;
  replay: boolean | null;
  sound: {
    apple_id: string;
    id: string;
  };
};

async function cacheEntries(ids: string[]): Promise<(EntryData | null)[]> {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    console.error("Unauthorized, missing DB in environment");
    throw new Error("Database configuration missing");
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });
  const entries: Record<string, EntryData | null> = {};

  try {
    const cachedResults = await Promise.all(
      ids.map(async (id) => {
        const key = `entry:${id}:data`;
        try {
          const data = await getCache(key);
          return data ? data : null;
        } catch (err) {
          console.error(`Cache retrieval failed for ${key}: ${err}`);
          return null;
        }
      }),
    );

    const idsToFetch = ids.filter((_, index) => cachedResults[index] === null);

    ids.forEach((id, index) => {
      entries[id] = cachedResults[index];
    });

    if (idsToFetch.length > 0) {
      const missingEntries = await prisma.entry.findMany({
        where: { id: { in: idsToFetch }, is_deleted: false },
        select: {
          id: true,
          author: { select: { id: true, username: true, image: true } },
          type: true,
          text: true,
          rating: true,
          loved: true,
          replay: true,
          sound: { select: { apple_id: true, type: true, id: true } },
        },
      });

      await Promise.all(
        missingEntries.map((entry) => {
          entries[entry.id] = entry;
          return setCache(
            `entry:${entry.id}:data`,
            JSON.stringify(entry),
            3600,
          );
        }),
      );
    }
  } catch (err) {
    console.error(`Failed processing entries: ${err}`);
    throw err;
  }

  return ids.map((id) => entries[id] || null);
}

export { cacheEntries };

export const runtime = "edge";
