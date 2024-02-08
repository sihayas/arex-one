import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReplyTargetType } from "@/context/Threadcrumbs";

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

export const useChainQuery = (userId: string, replyId: string | undefined) =>
  useInfiniteQuery(
    ["replies", replyId],
    async ({ pageParam = 1 }) => {
      const url = `/api/artifact/get/chain`;
      const params = { replyId, userId, page: pageParam, limit: 6 };

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

export const addReply = async (
  replyTarget: ReplyTargetType,
  text: string,
  userId: string,
) => {
  if (!replyTarget) return console.error("No reply target found.");

  const artifact = replyTarget.artifact;
  const reply = replyTarget.reply;

  // Replying directly to an artifact
  const artifactId = artifact.id;
  const artifactAuthorId = artifact.author.id;
  const rootId = reply ? reply.rootId : null; //*

  // Replying to a reply
  const toReplyId = reply ? reply.id : null; //**
  const toReplyAuthorId = reply ? reply.author.id : null;
  const toReplyParentId = reply ? reply.replyToId : null;
  const requestBody = {
    artifactId,
    artifactAuthorId,
    rootId,
    toReplyId,
    toReplyAuthorId,
    toReplyParentId,
    text,
    userId,
  };

  try {
    const res = await axios.post("/api/artifact/post/reply", requestBody);
    if (res.status !== 200) {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

//*
// if reply parent has a reply to id, it's a reply to a reply, so the root_id
// value exists, use it. else, the parent is a main artifact reply, so the
// root id is the id of the parent

//** there are more replies up the chain to notify if the root id is not the
// same as the reply we're replying to id
