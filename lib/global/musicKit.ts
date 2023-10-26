import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";

const token = process.env.NEXT_PUBLIC_MUSICKIT_TOKEN || "";
const baseURL = "https://api.music.apple.com/v1/catalog/us";

// Helper function to check if the title contains unwanted keywords
const isUnwanted = (title: string) => {
  const unwantedKeywords = ["remix", "edition", "mix"];
  return unwantedKeywords.some((keyword) =>
    title.toLowerCase().includes(keyword)
  );
};

// Search for sounds method
export const searchAlbums = async (keyword: string) => {
  const limit = 12;
  const types = "albums,songs";
  const url = `${baseURL}/search?term=${encodeURIComponent(
    keyword
  )}&limit=${limit}&types=${types}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Limit to 12 results
  const songs = response.data.results.songs.data
    .filter((song: SongData) => !isUnwanted(song.attributes.albumName)) // Check if the song title contains unwanted keywords
    .slice(0, 8);

  const albums = response.data.results.albums.data
    .filter(
      (album: AlbumData) =>
        !album.attributes.isSingle && // Check if the album is not a single
        !isUnwanted(album.attributes.name) // Check if the album title contains unwanted keywords
    )
    .slice(0, 4);

  return { filteredSongs: songs, filteredAlbums: albums };
};

// Fetch one or more sounds by multiple types (songs and albums)
export const fetchSoundsByTypes = async (idTypes: Record<string, string[]>) => {
  const idParams = Object.entries(idTypes)
    .flatMap(([type, ids]) =>
      ids.length > 0 ? `ids[${type}]=${ids.join(",")}` : []
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

// Fetch one or more sounds by a single type (song or album)
export const fetchSoundsbyType = async (type: string, ids: string[]) => {
  if (ids.length === 0) return [];
  const response = await axios.get(`${baseURL}/${type}?ids=${ids.join(",")}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
