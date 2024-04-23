import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { attachSoundData } from "@/lib/helper/feed";

export const useSoundInfoQuery = (soundId: string) =>
  useQuery(
    ["sound", soundId],
    async () => {
      const url = `/api/sound/get?soundId=${encodeURIComponent(soundId)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    { enabled: !!soundId, refetchOnWindowFocus: false },
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
