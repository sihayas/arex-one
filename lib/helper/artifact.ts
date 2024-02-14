import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReplyTargetType } from "@/context/Threadcrumbs";
import { AlbumData, SongData } from "@/types/appleTypes";

export const createEntry = async (submissionData: {
  text: string;
  rating: number;
  loved: boolean;
  userId: string;
  sound: AlbumData | SongData;
}) => {
  // No rating means it's a wisp
  const endpoint = "/api/artifact/post/artifact";

  try {
    const response = await axios.post(endpoint, submissionData);

    if (response.status === 201) {
      console.log("Submission successful", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    throw new Error(`Error during submission:`);
  }
};

export const createReply = async (
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

export const deleteEntry = async (artifactId: string) => {
  const endpoint = "/api/artifact/delete/artifact";

  try {
    const response = await axios.patch(endpoint, { artifactId });

    if (response.status === 200) {
      console.log("Deletion successful", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error(`Error during deletion:`);
  }
};

export const flagEntry = async (referenceId: string, type: string) => {
  const endpoint = "/api/artifact/post/flag";

  try {
    const response = await axios.post(endpoint, { referenceId, type });

    if (response.status === 200) {
      console.log("Flagging successful", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error flagging data:", error);
    throw new Error(`Error during flagging:`);
  }
};

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
