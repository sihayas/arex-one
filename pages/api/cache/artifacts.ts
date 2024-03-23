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

async function cacheArtifacts(ids: string[]): Promise<ArtifactData[]> {
  const artifacts: Record<string, ArtifactData> = {};

  // Attempt to retrieve activity data from cache
  const cachedResults = await Promise.all(
    ids.map(async (id) => {
      const key = `artifact:${id}:data`;
      const data = await getCache(key);
      return data ? data : null;
    }),
  );

  // Determine which activities were not found in the cache
  const idsToFetch = ids.filter((_, index) => cachedResults[index] === null);

  // Populate the activities record with cache hits
  ids.forEach((id, index) => {
    if (cachedResults[index] !== null) {
      artifacts[id] = cachedResults[index];
    }
  });

  // Fetch missing artifacts from the database
  if (idsToFetch.length > 0) {
    const missingArtifacts = await prisma.artifact.findMany({
      where: { id: { in: idsToFetch }, isDeleted: false },
      select: {
        id: true,
        author: { select: { id: true, username: true, image: true } },
        type: true,
        content: {
          select: { text: true, rating: true, loved: true, replay: true },
        },
        sound: { select: { appleId: true, type: true, id: true } },
      },
    });

    await Promise.all(
      missingArtifacts.map((artifact) => {
        artifacts[artifact.id] = artifact;
        return setCache(
          `artifact:${artifact.id}:data`,
          JSON.stringify(artifact),
          3600,
        );
      }),
    );
  }

  return ids.map((id) => artifacts[id] || null);
}

export { cacheArtifacts };

export const runtime = "edge";
