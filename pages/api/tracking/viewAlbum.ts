import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const album = req.body;
  const session = await getSession({ req });

  if (req.method === "POST") {
    try {
      const existingAlbum = await prisma.album.upsert({
        where: {
          id: album.id,
        },
        update: {
          viewsCount: {
            increment: 1,
          },
        },
        create: {
          id: album.id,
          name: album.attributes.name,
          releaseDate: album.attributes.releaseDate,
          artist: album.attributes.artistName,
          viewsCount: 1,
        },
      });

      const reviews = await prisma.review.findMany({
        where: {
          albumId: album.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          replies: {
            select: {
              _count: true,
            },
          },
          likes: true,
        },
      });

      const reviewsWithUserLikes = reviews.map((review) => {
        const likedByUser = session
          ? review.likes.some((like) => like.authorId === session.user.id)
          : false;

        return {
          ...review,
          likedByUser,
        };
      });

      res
        .status(200)
        .json({ album: existingAlbum, reviews: reviewsWithUserLikes });
    } catch (error) {
      console.error("Error updating view count and fetching reviews:", error);
      res
        .status(500)
        .json({ error: "Error updating view count and fetching reviews." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
