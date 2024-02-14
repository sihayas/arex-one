import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

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
      const url = `/api/album/get/artifacts`;
      const { data } = await axios.get(url, {
        params: { soundId, page: pageParam, sort, userId, range, limit: 12 },
      });
      const { activities, pagination } = data.data;

      if (!activities || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      return { data: activities, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
