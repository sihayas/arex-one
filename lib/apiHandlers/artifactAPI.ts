// New function to get root replies for a specific review
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Artifact, Reply } from "@/types/dbTypes";
import { ReplyParent } from "@/context/Threadcrumbs";

interface RepliesProps {
  artifactId?: string;
  replyId?: string;
  userId: string;
}

export const fetchReplies = async ({
  artifactId,
  replyId,
  userId,
}: RepliesProps) => {
  const baseURL = "/api/reply/get";

  // Decide URL based on presence of reviewId or replyId
  const url = artifactId
    ? `${baseURL}/artifactReplies`
    : `${baseURL}/replyReplies`;

  return axios
    .get(url, {
      params: {
        artifactId: artifactId ? artifactId : undefined,
        replyId: replyId ? replyId : undefined,
        userId,
      },
    })
    .then((res) => res.data);
};

export const useRepliesQuery = (
  artifactId: string | undefined,
  userId: string,
) => {
  const { data, isLoading, isError } = useQuery(
    ["replies", artifactId],
    () => fetchReplies({ artifactId, userId }),
    { enabled: !!artifactId, refetchOnWindowFocus: false },
  );

  return { data, isLoading, isError };
};

export const addReply = async (
  replyParent: ReplyParent,
  text: string,
  userId: string,
) => {
  if (!replyParent.artifact) return console.error("No artifact found");

  let artifactId = replyParent.artifact.id;
  let artifactAuthorId = replyParent.artifact.authorId;
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
