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
      ? "/api/record/caption/post/submitCaption"
      : "/api/record/record/post/submitEntry";

  try {
    const response = await axios.post(endpoint, submissionData);

    if (response.status === 201) {
      console.log("Submission successful", response.data);
      return response.data;
    } else {
      // You could log this case or handle it as per your application's needs
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    // Re-throwing the error to be handled by the caller, if needed
    throw new Error(`Error during submission:`);
  }
};
