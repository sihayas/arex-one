import { NextApiRequest, NextApiResponse } from "next";
import { searchAlbums } from "@/lib/global/musicKit";
import { prisma } from "@/lib/global/prisma"; // Make sure to import Prisma
// client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req.query;

  if (typeof query === "undefined") {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }

  // Convert query to string if it's an array
  const keyword = typeof query === "string" ? query : query.join(" ");

  // Fetch filtered albums and songs from Apple's database
  const appleResponse = await searchAlbums(keyword);

  // Fetch users related to the search query from our own database
  const usersResponse = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: keyword } },
        { name: { contains: keyword } },
      ],
    },
  });

  // Combine Apple's data and users from our own database
  const combinedResponse = {
    appleData: appleResponse,
    users: usersResponse,
  };

  res.json(combinedResponse);
}

// for (const album of apple_response.filteredAlbums) {
//   const averageRating = await client.get(`album:${album.id}:averageRating`);

//   if (averageRating !== null) {
//     album.averageRating = parseFloat(averageRating);
//   } else {
//     album.averageRating = "n/a"; // default value
//   }
// }
