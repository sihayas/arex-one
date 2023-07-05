import { useContext } from "react";
import {
  ReviewDetailsContext,
  ReviewDetailsContextType,
} from "../context/CMDKReview";

export const useReviewDetails = (): ReviewDetailsContextType => {
  const context = useContext(ReviewDetailsContext);
  if (!context) {
    throw new Error(
      "useReviewDetails must be used within ReviewDetailsProvider"
    );
  }
  return context;
};

export default useReviewDetails;
