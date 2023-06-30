import axios from "axios";

//Listen for Post request from route /api/reviews.ts
export const submitReview = async (reviewData: any) => {
  try {
    const response = await axios.post("/api/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error submitting the review:", error);
    return null;
  }
};
