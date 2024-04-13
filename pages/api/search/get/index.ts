import { searchAlbums } from "@/lib/global/musickit";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { createResponse } from "@/pages/api/middleware";

export default async function onRequest(request: any) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return createResponse({ error: "Unauthorized, DB missing in env" }, 401);
  }
  const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });

  if (!query) {
    return createResponse({ error: "Query parameter is required" }, 400);
  }

  // Fetch filtered albums and songs from Apple's database
  const appleResponse = await searchAlbums(query);

  // Fetch users related to the search query from our own database
  const usersResponse = await prisma.user.findMany({
    where: {
      OR: [{ username: { contains: query } }],
    },
  });

  // Combine Apple's data and users from our own database
  return createResponse(
    { appleData: appleResponse, users: usersResponse },
    200,
  );
}

export const runtime = "edge";
