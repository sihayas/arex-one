import axios from "axios";

// Fetch user review for the album and signed-in user
export const fetchUserReview = async (albumId: string, userId: string) => {
  try {
    const response = await axios.get(
      `/api/review/formCheck?albumId=${albumId}&userId=${userId}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error fetching user review:", error);
    return false;
  }
};

export const postReview = async (
  listened: boolean,
  rating: number,
  loved: boolean,
  reviewText: string,
  isReReview: boolean,
  authorId: string | undefined,
  albumId: string | undefined,
  albumName: string | undefined
) => {
  try {
    const response = await axios.post("/api/review/postReview", {
      listened,
      rating,
      loved,
      reviewText,
      isReReview,
      authorId,
      albumId,
      albumName,
    });

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
