import axios from "axios";
import { AlbumData } from "./interfaces";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";

// Search for albums method
// Helper function to check if the album title contains unwanted keywords
const isUnwanted = (title: string) => {
  const unwantedKeywords = ["remix", "edition", "mix"];
  return unwantedKeywords.some((keyword) =>
    title.toLowerCase().includes(keyword)
  );
};

// Search for albums method
export const searchAlbums = async (keyword: string) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/search";

  const response = await axios.get(baseURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      term: keyword,
      limit: 25, // Increase the limit to get more results initially
      types: "albums",
    },
  });

  // Filter the results based on the isSingle property, unwanted keywords, and limit to 8 results
  const filteredResults = response.data.results.albums.data
    .filter(
      (album: AlbumData) =>
        !album.attributes.isSingle && // Check if the album is not a single
        !isUnwanted(album.attributes.name) // Check if the album title contains unwanted keywords
    )
    .slice(0, 6);

  return filteredResults;
};

//Search for a specific album
export const getAlbumById = async (albumId: string) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/albums";

  const response = await axios.get(`${baseURL}/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data[0];
};

//Search for multiple albums
export const getAlbumsByIds = async (albumIds: string[]) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/albums";

  const response = await axios.get(`${baseURL}?ids=${albumIds.join(",")}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
