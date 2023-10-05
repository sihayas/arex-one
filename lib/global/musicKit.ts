import axios from "axios";
import { AlbumData, SongData } from "./interfaces";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";

// Helper function to check if the title contains unwanted keywords
const isUnwanted = (title: string) => {
  const unwantedKeywords = ["remix", "edition", "mix"];
  return unwantedKeywords.some((keyword) =>
    title.toLowerCase().includes(keyword),
  );
};

// Search for albums method
export const searchAlbums = async (keyword: string) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/search";
  const limit = 12;
  const types = "albums,songs";
  const url = `${baseURL}?term=${encodeURIComponent(
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
    .slice(0, 3); // Limit to 8 results

  return { filteredSongs: songs, filteredAlbums: albums };
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

// Search for an album by song ID
export const getAlbumBySongId = async (songId: string) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/songs/";

  const response = await axios.get(`${baseURL}${songId}/albums`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data[0];
};

// Search for multiple albums by song IDs
export const getAlbumsBySongIds = async (songIds: string[]) => {
  const baseURL = "https://api.music.apple.com/v1/catalog/us/songs/";
  const response = await axios.get(`${baseURL}?ids=${songIds.join(",")}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
