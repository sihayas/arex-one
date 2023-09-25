// New function to get root replies for a specific review
import axios from "axios";

export const getRootRepliesForReview = async (
  reviewId: string | undefined,
  userId: string | undefined,
) => {
  const url = `/api/reply/get/reviewReplies?reviewId=${reviewId}&userId=${userId}`;
  const response = await axios.get(url);
  console.log("response.data", response.data);
  return response.data;
};

interface RepliesProps {
  reviewId?: string;
  userId?: string;
  setLoadingReplies?: (loading: boolean) => void;
}
export const fetchReplies = ({ reviewId, userId }: RepliesProps) => {
  const url = `/api/reply/get/reviewReplies?id=${reviewId}&userId=${userId}`;
  return axios.get(url).then((res) => res.data);
};
