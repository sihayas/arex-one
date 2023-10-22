// New function to get root replies for a specific review
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  userId: string
) => {
  const { data, isLoading, isError } = useQuery(
    ["replies", recordId],
    () => fetchReplies({ recordId, userId }),
    { enabled: !!recordId, refetchOnWindowFocus: false }
  );

  return { data, isLoading, isError };
};
