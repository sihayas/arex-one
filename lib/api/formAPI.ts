import axios from "axios";

export const postEntry = async (submissionData: {
  text: string;
  rating: number;
  loved: boolean;
  userId: string;
  appleAlbumId: string | undefined;
  appleTrackId: string | undefined;
}) => {
  try {
    console.log("Submitting review:", submissionData);
    const response = await axios.post(
      "/api/record/entry/post/submitEntry",
      submissionData,
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
