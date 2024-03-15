import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { ReplyType } from "@/types/dbTypes";

async function fetchOrCacheRoots(ids: string[]): Promise<ReplyType[]> {
  const replyData: Record<string, ReplyType> = {};
  const idsToFetch: string[] = [];

  // Initiate cache lookups in parallel for all root reply IDs
  const cachePromises = ids.map(async (id) => {
    const cacheKey = `reply:${id}:data`;
    const data = await getCache(cacheKey);
    return data ? JSON.parse(data) : null; // Assuming getCache returns a JSON string.
  });
  const cacheResults = await Promise.all(cachePromises);

  // Process cache results and identify IDs not in cache
  cacheResults.forEach((data, index) => {
    const id = ids[index];
    if (data) {
      replyData[id] = data;
    } else {
      idsToFetch.push(id);
    }
  });

  // Fetch data from database for IDs not found in cache
  if (idsToFetch.length > 0) {
    const fetchedReplies = await prisma.reply.findMany({
      where: { id: { in: idsToFetch }, isDeleted: false },
      select: {
        id: true,
        author: { select: { id: true, username: true, image: true } },
        text: true,
        replyToId: true,
        rootId: true,
      },
    });

    // Update replyData with fetched replies and cache them
    await Promise.all(
      fetchedReplies.map(async (reply) => {
        //  @ts-ignore
        replyData[reply.id] = reply;
        const cacheKey = `reply:${reply.id}:data`;
        await setCache(cacheKey, JSON.stringify(reply), 3600);
      }),
    );
  }

  // Compile and return results
  return ids.map((id) => replyData[id]).filter((reply) => reply !== undefined);
}

export { fetchOrCacheRoots };
