// New function to get root replies for a specific review
import axios from "axios";

export const getRootRepliesForReview = async (
  reviewId: string | undefined,
  userId: string | undefined,
) => {
  const url = `/api/reply/get/reviewReplies?reviewId=${reviewId}&userId=${userId}`;
  const response = await axios.get(url);
  return response.data;
};

interface RepliesProps {
  reviewId?: string;
  replyId?: string;
  userId: string | undefined;
}
export const fetchReplies = async ({
  reviewId,
  replyId,
  userId,
}: RepliesProps) => {
  const baseURL = "/api/reply/get/";

  // Decide URL based on presence of reviewId or replyId
  const url = reviewId
    ? `${baseURL}reviewReplies?reviewId=${reviewId}&userId=${userId}`
    : `${baseURL}replyReplies?replyId=${replyId}&userId=${userId}`;

  return axios.get(url).then((res) => res.data);
};
