import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useSoundInfoQuery = (appleId: string) =>
  useQuery(
    ["sound", appleId],
    async () => {
      const url = `/api/sound/get`;
      const { data } = await axios.get(url, { params: { appleId } });
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
      const url = `/api/sound/get/artifacts`;
      const { data } = await axios.get(url, {
        params: { soundId, page: pageParam, sort, userId, range, limit: 12 },
      });
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
