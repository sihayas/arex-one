import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useSoundInfoQuery = (appleId?: string) =>
  useQuery(
    ["sound", appleId],
    async () => {
      if (!appleId) {
        throw new Error("appleId is required");
      }
      const url = `/api/sound/get?appleId=${encodeURIComponent(appleId)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    },
    { enabled: !!appleId, refetchOnWindowFocus: false },
  );

// Fetch entries on sound page
export const useEntriesQuery = (
  soundId: string,
  userId: string | undefined,
  sort: string,
  range: number | null,
) =>
  useInfiniteQuery(
    ["entries", soundId, sort, range],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        soundId,
        page: pageParam.toString(),
        sort,
        userId: userId ?? "",
        range: range?.toString() ?? "",
        limit: "12",
      }).toString();
      const url = `/api/sound/get/entries?${queryParams}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const { entries, pagination } = data.data;

      if (!entries || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      return { data: entries, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
