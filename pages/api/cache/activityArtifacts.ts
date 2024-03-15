import { getCache, setCache } from "@/lib/global/redis";
import { prisma } from "@/lib/global/prisma";
import { Sound, UserType } from "@/types/dbTypes";
import { Artifact as PrismaArtifact } from "@prisma/client";

type AuthorData = Pick<UserType, "id">;

type ArtifactType = PrismaArtifact["type"];

type SoundData = Pick<Sound, "appleId">;

type ArtifactData = {
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
  id: string;
  artifact?: ArtifactData | null;
};

async function cacheActivityArtifacts(ids: string[]): Promise<ActivityData[]> {
  const activities: Record<string, ActivityData> = {};

  // Attempt to retrieve activity data from cache
  const cachedResults = await Promise.all(
    ids.map(async (id) => {
      const key = `activity:${id}:artifact:data`;
      const data = await getCache(key);
      return data ? data : null;
    }),
  );

  // Determine which activities were not found in the cache
  const idsToFetch = ids.filter((_, index) => cachedResults[index] === null);

  // Populate the activities record with cache hits
  ids.forEach((id, index) => {
    if (cachedResults[index] !== null) {
      activities[id] = cachedResults[index];
    }
  });

  // Fetch missing activities from the database
  if (idsToFetch.length > 0) {
    const missingActivities = await prisma.activity.findMany({
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
            sound: { select: { appleId: true, type: true, id: true } },
          },
        },
      },
    });

    await Promise.all(
      missingActivities.map((activity) => {
        activities[activity.id] = activity;
        return setCache(
          `activity:${activity.id}:artifact:data`,
          JSON.stringify(activity),
          3600,
        );
      }),
    );
  }

  return ids.map((id) => activities[id] || null);
}

export { cacheActivityArtifacts };

export const runtime = "edge";
