// New function to get root replies for a specific review
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
  const url = recordId
    ? `${baseURL}recordReplies?recordId=${recordId}&userId=${recordId}`
    : `${baseURL}replyReplies?replyId=${replyId}&userId=${userId}`;

  return axios.get(url).then((res) => res.data);
};
