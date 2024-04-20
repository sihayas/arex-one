import { useInfiniteQuery } from "@tanstack/react-query";
import { AlbumData, SongData } from "@/types/appleTypes";
import { Entry, Sound } from "@prisma/client";

type SoundExtended = Sound & { appleData: AlbumData | SongData };
type EntryExtended = Entry & { sound: SoundExtended };

export const useFeedQuery = (userId: string) => {
  return useInfiniteQuery(
    ["feed", userId],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        userId,
        page: pageParam.toString(),
      });
      const response = await fetch(
        `/api/user/get/feed?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const pagination = data.pagination;
      const entries = await attachSoundData(data.entries);

      return { data: entries, pagination: pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

export const attachSoundData = async (entries: EntryExtended[]) => {
  const albumIds: string[] = [];
  const songIds: string[] = [];

  entries.forEach((entry: EntryExtended) => {
    const { type, apple_id } = entry.sound;
    if (type === "albums") albumIds.push(apple_id);
    else if (type === "songs") songIds.push(apple_id);
  });

  // Fetch album and track data
  const idTypes = { albums: albumIds, songs: songIds };
  const response = await fetch("/api/cache/sounds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(idTypes),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const { albums, songs } = await response.json();

  // Create maps for albums and tracks
  const albumMap = new Map(albums.map((album: AlbumData) => [album.id, album]));
  const songMap = new Map(songs.map((song: SongData) => [song.id, song]));

  // Attach album and track data to activity entries
  entries.forEach((entry) => {
    const { type, apple_id } = entry.sound;
    if (type === "albums")
      entry.sound.appleData = albumMap.get(apple_id) as AlbumData;
    else if (type === "songs")
      entry.sound.appleData = songMap.get(apple_id) as SongData;
  });

  return entries;
};
