import axios from "axios";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";

// Search for albums method
// Helper function to check if the album title contains unwanted keywords
const isUnwanted = (title) => {
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
      (album) =>
        !album.attributes.isSingle && // Check if the album is not a single
        !isUnwanted(album.attributes.name) // Check if the album title contains unwanted keywords
    )
    .slice(0, 8);

  return filteredResults;
};

//Search for a specific album
export const fetchAlbumById = async (albumId: string) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/albums";

  const response = await axios.get(`${baseURL}/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
