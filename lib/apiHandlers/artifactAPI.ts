// New function to get root replies for a specific review
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Artifact, Reply } from "@/types/dbTypes";

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

const isArtifact = (
  replyParent: Artifact | Reply | null,
): replyParent is Artifact => {
  return (replyParent as Artifact).appleAlbumData !== undefined;
};

export const addReply = async (
  recordAuthorId: string,
  replyParent: Artifact | Reply,
  replyContent: string,
  userId: string,
  type: string,
) => {
  if (!replyParent) return;

  const isReply = !isArtifact(replyParent) && type === "reply";
  const isRecordType = isArtifact(replyParent) && type === "artifact";

  const requestBody = {
    recordAuthorId,
    replyId: isReply ? replyParent.id : null, // Only if replyToReply
    recordId: isRecordType // Access artifact id depending on reply or artifact
      ? replyParent.id
      : isReply
      ? replyParent.artifactId
      : null,
    text: replyContent,
    userId,
  };

  try {
    const res = await axios.post("/api/artifact/entry/post/reply", requestBody);
    if (res.status !== 200) {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
