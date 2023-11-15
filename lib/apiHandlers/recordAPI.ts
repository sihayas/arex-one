// New function to get root replies for a specific review
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Record, Reply } from "@/types/dbTypes";

interface RepliesProps {
  recordId?: string;
  replyId?: string;
  userId: string;
}
export const fetchReplies = async ({
  recordId,
  replyId,
  userId,
}: RepliesProps) => {
  const baseURL = "/api/reply/get/";

  // Decide URL based on presence of reviewId or replyId
  const url = recordId ? `${baseURL}recordReplies` : `${baseURL}replyReplies`;

  return axios
    .get(url, {
      params: {
        recordId: recordId ? recordId : undefined,
        replyId: replyId ? replyId : undefined,
        userId,
      },
    })
    .then((res) => res.data);
};

export const useRepliesQuery = (
  recordId: string | undefined,
  userId: string,
) => {
  const { data, isLoading, isError } = useQuery(
    ["replies", recordId],
    () => fetchReplies({ recordId, userId }),
    { enabled: !!recordId, refetchOnWindowFocus: false },
  );

  return { data, isLoading, isError };
};

const isRecord = (
  replyParent: Record | Reply | null,
): replyParent is Record => {
  return (replyParent as Record).appleAlbumData !== undefined;
};

export const addReply = async (
  recordAuthorId: string,
  replyParent: Record | Reply,
  replyContent: string,
  userId: string,
  type: string,
) => {
  if (!replyParent) return;

  const isReply = !isRecord(replyParent) && type === "reply";
  const isRecordType = isRecord(replyParent) && type === "record";

  const requestBody = {
    recordAuthorId,
    replyId: isReply ? replyParent.id : null, // Only if replyToReply
    recordId: isRecordType // Access record id depending on reply or record
      ? replyParent.id
      : isReply
      ? replyParent.recordId
      : null,
    rootReplyId: isReply ? replyParent.rootReplyId : null,
    content: replyContent,
    userId,
  };

  try {
    const res = await axios.post("/api/record/entry/post/reply", requestBody);
    if (res.status !== 200) {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
