import { searchAlbums } from "@/lib/global/musickit";
import { prisma } from "@/lib/global/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
      OR: [{ username: { contains: keyword } }],
    },
  });

  // Combine Apple's data and users from our own database

  return res
    .status(200)
    .json({ appleData: appleResponse, users: usersResponse });
}
