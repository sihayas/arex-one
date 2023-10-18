import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";
const baseURL = "https://api.music.apple.com/v1/catalog/us";

// Helper function to check if the title contains unwanted keywords
const isUnwanted = (title: string) => {
  const unwantedKeywords = ["remix", "edition", "mix"];
  return unwantedKeywords.some((keyword) =>
    title.toLowerCase().includes(keyword),
  );
};

// Search for albums method
export const searchAlbums = async (keyword: string) => {
  const limit = 12;
  const types = "albums,songs";
  const url = `${baseURL}/search?term=${encodeURIComponent(
    keyword,
  )}&limit=${limit}&types=${types}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const songs = response.data.results.songs.data
    .filter((song: SongData) => !isUnwanted(song.attributes.albumName)) // Check if the song title contains unwanted keywords
    .slice(0, 5); // Limit to 8 results

  const albums = response.data.results.albums.data
    .filter(
      (album: AlbumData) =>
        !album.attributes.isSingle && // Check if the album is not a single
        !isUnwanted(album.attributes.name), // Check if the album title contains unwanted keywords
    )
    .slice(0, 3);

  return { filteredSongs: songs, filteredAlbums: albums };
};

//Search for a specific album
export const getAlbumById = async (albumId: string) => {
  const response = await axios.get(`${baseURL}/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data[0];
};

//Search for multiple albums
export const getAlbumsByIds = async (albumIds: string[]) => {
  if (albumIds.length === 0) return [];
  const response = await axios.get(
    `${baseURL}/albums?ids=${albumIds.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.data;
};

// Search for an album by song ID
export const getAlbumBySongId = async (songId: string) => {
  const response = await axios.get(`${baseURL}/songs/${songId}/albums`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data[0];
};

// Search for multiple albums by song IDs

export const getAlbumsBySongIds = async (songIds: string[]) => {
  if (songIds.length === 0) return [];
  const response = await axios.get(
    `${baseURL}/songs?ids=${songIds.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.data;
};

export const getAnyByIds = async (idTypes: Record<string, string[]>) => {
  const idParams = Object.entries(idTypes)
    .flatMap(([type, ids]) =>
      ids.length > 0 ? `ids[${type}]=${ids.join(",")}` : [],
    )
    .join("&");

  if (!idParams) return [];


  const response = await axios.get(`${baseURL}?${idParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
