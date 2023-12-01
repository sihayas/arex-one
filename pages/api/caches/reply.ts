import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { ReplyType } from "@/types/dbTypes";

async function fetchOrCacheRoots(ids: string[]): Promise<ReplyType[]> {
  const replyData: Record<string, ReplyType> = {};
  const idsToFetch: string[] = [];

  // Initiate cache lookups in parallel for all root reply IDs
  const cachePromises = ids.map((id) => getCache(`reply:${id}:data`));
  const cacheResults = await Promise.allSettled(cachePromises);

  // Process cache results and identify IDs not in cache
  cacheResults.forEach((result, index) => {
    const id = ids[index];
    if (result.status === "fulfilled" && result.value) {
      replyData[id] = result.value;
    } else {
      idsToFetch.push(id);
    }
  });

  // Fetch data from database for IDs not found in cache
  if (idsToFetch.length > 0) {
    const data = await prisma.reply.findMany({
      where: { id: { in: idsToFetch }, isDeleted: false },
      select: {
        id: true,
        author: { select: { id: true, username: true, image: true } },
        text: true,
      },
    });

    const enrichReplyData = data.map((activity) => {
      // Set the reply to its corresponding ID
      const id = idsToFetch[data.indexOf(activity)];
      //@ts-ignore
      replyData[id] = activity;
      // Cache the reply data
      return setCache(`reply:${id}:data`, activity, 3600);
    });

    await Promise.all(enrichReplyData);
  }

  // Compile and return results
  return ids.map((id) => replyData[id]);
}

export { fetchOrCacheRoots };
