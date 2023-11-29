import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { Activity, Artifact, Sound, User } from "@/types/dbTypes";
import { Artifact as PrismaArtifact } from "@prisma/client";

type AuthorData = Pick<User, "id" | "username" | "image">;

type ArtifactType = PrismaArtifact["type"];

type SoundData = Pick<Sound, "appleId">;

type ArtifactData = {
  id: Artifact["id"];
  type: ArtifactType;
  content?: {
    text: string;
    rating: number | null;
    loved: boolean | null;
    replay: boolean | null;
  } | null;
  sound: SoundData;
  author: AuthorData;
};

type ActivityData = {
  id: Activity["id"];
  artifact?: ArtifactData | null;
};

async function getActivityData(activityIds: string[]): Promise<ActivityData[]> {
  const activityDataResults: Record<string, ActivityData> = {};
  const idsToFetch: string[] = [];

  // Initiate cache lookups in parallel for all activity IDs
  const cachePromises = activityIds.map((id) =>
    getCache(`activity:artifact:${id}:data`),
  );
  const cacheResults = await Promise.all(cachePromises);

  // Process cache results, identify IDs not in cache
  cacheResults.forEach((cachedData, index) => {
    const id = activityIds[index];
    if (cachedData) {
      activityDataResults[id] = cachedData;
    } else {
      idsToFetch.push(id);
    }
  });

  // Fetch data from database for IDs not found in cache
  if (idsToFetch.length > 0) {
    const fetchedActivities = await prisma.activity.findMany({
      where: { id: { in: idsToFetch }, isDeleted: false },
      select: {
        id: true,
        artifact: {
          select: {
            id: true,
            author: { select: { id: true, username: true, image: true } },
            type: true,
            content: {
              select: { text: true, rating: true, loved: true, replay: true },
            },
            sound: { select: { appleId: true, type: true } },
          },
        },
      },
    });

    // Process fetched activities
    for (const activity of fetchedActivities) {
      activityDataResults[activity.id] = activity;
      await setCache(`activity:artifact:${activity.id}:data`, activity, 3600);
    }
  }

  // Compile and return results
  return activityIds.map((id) => activityDataResults[id]);
}

export { getActivityData };
