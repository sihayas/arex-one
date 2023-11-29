import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReplyParent } from "@/context/Threadcrumbs";

export const useRepliesQuery = (
  userId: string,
  artifactId?: string | undefined,
  replyId?: string | undefined,
) => {
  const isArtifactReplies = !!artifactId;

  const queryKey = isArtifactReplies
    ? ["replies", artifactId]
    : ["replies", replyId];
  const url = isArtifactReplies
    ? `/api/artifact/get/artifactReplies`
    : `/api/artifact/get/replyReplies`;

  const result = useQuery(
    queryKey,
    async () => {
      const params = isArtifactReplies
        ? { artifactId, userId }
        : { replyId, userId };
      const { data } = await axios.get(url, { params });
      if (!data) throw new Error("Unexpected server response structure");
      return data;
    },
    {
      enabled: isArtifactReplies ? !!artifactId : !!replyId,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    isError: result.isError,
  };
};

export const addReply = async (
  replyParent: ReplyParent,
  text: string,
  userId: string,
) => {
  if (!replyParent.artifact) return console.error("No artifact found");

  let artifactId = replyParent.artifact.id;
  let artifactAuthorId = replyParent.artifact.author.id;
  let replyingToId: string | null = null;
  let replyingToReplyId: string | null = null;
  let rootId: string | null = null;

  // replying to a reply
  if (replyParent.reply) {
    //*
    rootId = replyParent.reply.rootId
      ? replyParent.reply.rootId
      : replyParent.reply.id;
    replyingToId = replyParent.reply.id;
    replyingToReplyId = replyParent.reply.replyToId || null;
  }

  const requestBody = {
    artifactId,
    artifactAuthorId,
    replyingToId,
    replyingToReplyId,
    rootId,
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
