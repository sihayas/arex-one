import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

// Get replies for an Artifact or a Reply on Artifact page
export const useRepliesQuery = (
  userId: string,
  artifactId?: string | undefined,
  replyId?: string | undefined,
) =>
  useInfiniteQuery(
    ["replies", artifactId || replyId],
    async ({ pageParam = 1 }) => {
      const isArtifactReplies = !!artifactId;

      const url = `/api/artifact/get/replies`;
      const params = isArtifactReplies
        ? { artifactId, userId, page: pageParam, limit: 6 }
        : { replyId, userId, page: pageParam, limit: 6 };

      const { data } = await axios.get(url, { params });

      const { replies, pagination } = data.data;

      if (!replies || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      return { data: replies, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

// Get a specific reply chain (helpful for notification mainly)
export const useChainQuery = (userId: string, replyId: string | undefined) =>
  useInfiniteQuery(
    ["replies", replyId],
    async ({ pageParam = undefined }) => {
      const url = `/api/artifact/get/chain`;
      const params = { replyId, userId, cursor: pageParam };

      const { data } = await axios.get(url, { params });

      const replies = data.replies;
      const cursor = data.pagination.nextPage;

      console.log(cursor);

      if (!replies) {
        throw new Error("Unexpected server response structure");
      }

      return { data: replies, nextPage: cursor };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

//*
// if reply parent has a reply to id, it's a reply to a reply, so the root_id
// value exists, use it. else, the parent is a main artifact reply, so the
// root id is the id of the parent

//** there are more replies up the chain to notify if the root id is not the
// same as the reply we're replying to id
