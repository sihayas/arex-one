import { searchAlbums } from "@/lib/global/musickit";
import { prisma } from "@/lib/global/prisma";

export default async function onRequest(request: any) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
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
  const combinedResponse = {
    appleData: appleResponse,
    users: usersResponse,
  };

  return new Response(JSON.stringify(combinedResponse), {
    headers: { "Content-Type": "application/json" },
  });
}

export const runtime = "edge";
