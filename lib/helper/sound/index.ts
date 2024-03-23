import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useSoundInfoQuery = (appleId: string) =>
  useQuery(
    ["sound", appleId],
    async () => {
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
export const useArtifactsQuery = (
  soundId: string,
  userId: string | undefined,
  sort: string,
  range: number | null,
) =>
  useInfiniteQuery(
    ["artifacts", soundId, sort, range],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        soundId,
        page: pageParam.toString(),
        sort,
        userId: userId ?? "",
        range: range?.toString() ?? "",
        limit: "12",
      }).toString();
      const url = `/api/sound/get/artifacts?${queryParams}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const { artifacts, pagination } = data.data;

      if (!artifacts || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      return { data: artifacts, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
