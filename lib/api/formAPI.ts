import axios from "axios";

// Fetch user review for the album and signed-in user
export const fetchUserReview = async (soundId: string, userId: string) => {
  try {
    const response = await axios.get(
      `/api/review/formCheck?albumId=${soundId}&userId=${userId}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error fetching user review:", error);
    return false;
  }
};

export const postReview = async (submissionData: {
  rating: number;
  loved: boolean;
  content: string;
  replay: boolean;
  userId: string | undefined;
  albumId: string | undefined;
  trackId: string | undefined;
}) => {
  try {
    console.log("Posting review...", submissionData);
    const response = await axios.post(
      "/api/review/post/review",
      submissionData
    );

    if (response.status === 201) {
      console.log("Review submitted successfully", response.data);
    } else {
      throw new Error("Unexpected response status");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
