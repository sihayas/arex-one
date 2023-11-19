import client from "@/lib/global/redis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;

    const start = (page - 1) * limit;
    const end = start + limit;

    // Fetch bloomEntries (recordIds) from Redis
    const entries = await client.zrevrange("bloomingEntries", start, end);

    // Check if there are more pages
    const hasMorePages = entries.length > limit;
    if (hasMorePages) {
      entries.pop(); // Remove the extra item if there are more pages
    }

    res.status(200).json({
      data: {
        entries,
        pagination: {
          nextPage: hasMorePages ? page + 1 : null,
        },
      },
    });
  } else {
    res.status(405).send("Method not allowed");
  }
}
