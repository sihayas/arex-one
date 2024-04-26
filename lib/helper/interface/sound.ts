import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { attachSoundData } from "@/lib/helper/feed";
import { fetchSourceAlbum } from "@/lib/global/musickit";

export const useSoundInfoQuery = (appleId: string, soundId?: string) =>
  useQuery(
    ["sound", appleId, soundId],
    async () => {
      let source;
      if (!soundId) {
        // unsure of the database id
        source = await fetchSourceAlbum(appleId);
        appleId = source.id;
      }
      const queryUrl = `/api/sound/get?appleId=${appleId}${
        soundId ? `&soundId=${soundId}` : ""
      }`;
      const response = await fetch(queryUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    { enabled: !!appleId, refetchOnWindowFocus: false, refetchOnMount: false },
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
