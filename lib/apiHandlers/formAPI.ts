import axios from "axios";

export const postEntry = async (submissionData: {
  text: string;
  rating: number;
  loved: boolean;
  userId: string;
  appleAlbumId?: string;
  appleTrackId?: string;
}) => {
  // Determine the correct endpoint and payload based on the rating
  const endpoint =
    submissionData.rating === 0
      ? "/api/record/caption/post/caption"
      : "/api/record/entry/post/entry";

  try {
    const response = await axios.post(endpoint, submissionData);

    if (response.status === 201) {
      console.log("Submission successful", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    throw new Error(`Error during submission:`);
  }
};
