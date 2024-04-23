import { AlbumData } from "@/types/apple";

const token = process.env.NEXT_PUBLIC_APPLE_JWT || "";
export const baseURL = "https://api.music.apple.com/v1/catalog/us";

// Fetch all related albums and select a single source album
export const fetchSourceAlbum = async (albumId: string | undefined) => {
  const url = `${baseURL}/albums/${albumId}?views=other-versions`;

  if (!albumId) {
    console.log("No album ID provided.");
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch album views");
    }

    const data = await response.json();

    // Combine main album and other versions into a single array
    const mainAlbum = data.data[0];
    const otherVersions = mainAlbum.views["other-versions"].data;
    const allAlbums = [mainAlbum, ...otherVersions];

    let tempAlbums = allAlbums;

    // Filter out albums with encapsulated terms (e.g. [Deluxe Edition], (Remastered))
    let filteredAlbums = tempAlbums.filter((album) => {
      const albumNameLower = album.attributes.name.toLowerCase();
      const editionRegex = /(\[[^\]]+\]|\([^\)]+\))\s*$/;
      return !editionRegex.test(albumNameLower);
    });

    // If filtering results in no albums, revert to considering all albums
    if (filteredAlbums.length === 0) {
      filteredAlbums = allAlbums;
    }

    // Further filter albums based on content rating, if applicable
    if (
      filteredAlbums.length > 1 &&
      filteredAlbums.every((album) => "contentRating" in album.attributes)
    ) {
      const explicitAlbums = filteredAlbums.filter(
        (album) => album.attributes.contentRating === "explicit",
      );
      filteredAlbums =
        explicitAlbums.length > 0
          ? explicitAlbums
          : filteredAlbums.filter(
              (album) => album.attributes.contentRating === "clean",
            );
    }

    // Sort by release date to find the earliest one
    filteredAlbums.sort(
      (a, b) =>
        new Date(a.attributes.releaseDate).getTime() -
        new Date(b.attributes.releaseDate).getTime(),
    );
    const earliestReleaseDate = filteredAlbums[0]?.attributes.releaseDate;
    const earliestAlbums = filteredAlbums.filter(
      (album) => album.attributes.releaseDate === earliestReleaseDate,
    );

    // Directly find the album with the smallest track count among the earliest albums
    if (earliestAlbums.length > 0) {
      const albumWithSmallestTrackCount = earliestAlbums.reduce(
        (minAlbum, currentAlbum) =>
          currentAlbum.attributes.trackCount < minAlbum.attributes.trackCount
            ? currentAlbum
            : minAlbum,
        earliestAlbums[0],
      );

      console.log(
        "Album with smallest track count:",
        albumWithSmallestTrackCount,
      );

      return albumWithSmallestTrackCount;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching album views:", error);
    return null;
  }
};

export const searchAlbums = async (keyword: string) => {
  const limit = 8;
  const types = "albums,songs";
  const url = `${baseURL}/search?term=${encodeURIComponent(
    keyword,
  )}&limit=${limit}&types=${types}&include[songs]=albums`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonData = await response.json();

  // Limit to 12 results
  const songs = jsonData.results.songs.data;

  const albums = jsonData.results.albums.data
    .filter((album: AlbumData) => !album.attributes.isSingle)
    .slice(0, 4);

  return { filteredSongs: songs, filteredAlbums: albums };
};

// Fetch one or more sounds by multiple types (songs and albums)
export const fetchSoundsByTypes = async (idTypes: Record<string, string[]>) => {
  const idParams = Object.entries(idTypes)
    .flatMap(([type, ids]) =>
      ids.length > 0
        ? `ids[${type}]=${ids.join(",")}&include[songs]=albums`
        : [],
    )
    .join("&");

  if (!idParams) return [];

  const url = `${baseURL}?${idParams}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};
