import axios from "axios";
import { AlbumData, SongData, TrackData } from "@/types/appleTypes";

export const postEntry = async (submissionData: {
  text: string;
  rating: number;
  loved: boolean;
  userId: string;
  sound: AlbumData | SongData;
}) => {
  // No rating means it's a wisp
  const endpoint = "/api/artifact/submit";

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
