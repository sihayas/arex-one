import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { attachSoundData } from "@/lib/helper/feed";
import { getSoundDatabaseId } from "@/lib/global/musickit";

export const useSoundInfoQuery = (
  appleId: string,
  soundId: string | undefined,
) =>
  useQuery(
    ["sound", appleId, soundId],
    async () => {
      if (!soundId) {
        soundId = await getSoundDatabaseId(appleId);

        // sound has no database id, return null
        if (!soundId) {
          return null;
        }
      }
      const response = await fetch(
        `/api/sound/get?soundId=${encodeURIComponent(soundId)}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    { enabled: !!appleId, refetchOnWindowFocus: false },
  );

export const useEntriesQuery = (
  soundId: string,
  userId: string,
  sort: string,
  range: string,
) =>
  useInfiniteQuery(
    ["entries", userId, soundId, sort, range],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        soundId,
        userId,
        sort,
        range: range?.toString(),
        page: pageParam.toString(),
      });
      const response = await fetch(
        `/api/sound/get/entries?${queryParams.toString()}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const pagination = data.pagination;
      const entries = await attachSoundData(data.entries);

      return { data: entries, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
