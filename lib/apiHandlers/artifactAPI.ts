// New function to get root replies for a specific review
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReplyParent } from "@/context/Threadcrumbs";
import { useInterfaceContext } from "@/context/InterfaceContext";

export const useRepliesQuery = (
  artifactId: string | undefined,
  userId: string,
) => {
  const { user } = useInterfaceContext();
  const isArtifactReplies = !!artifactId;
  const url = isArtifactReplies
    ? `/api/reply/get/artifactReplies`
    : `/api/reply/get/replyReplies`;

  const result = useQuery(
    ["replies", artifactId, userId],
    async () => {
      const params = {
        artifactId,
        userId,
        ...(isArtifactReplies && user?.id && { authUserId: user.id }),
      };
      const { data } = await axios.get(url, { params });
      if (!data) throw new Error("Unexpected server response structure");
      return data;
    },
    {
      enabled: !!artifactId,
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
