import { useInfiniteQuery } from "@tanstack/react-query";
import { EntryExtended, SoundData } from "@/types/global";

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
    if (entry.sound_type === "albums") albumIds.push(entry.sound_apple_id);
    else if (entry.sound_type === "songs") songIds.push(entry.sound_apple_id);
  });

  // Fetch album and track data
  const response = await fetch("/api/cache/sounds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ albums: albumIds, songs: songIds }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const { albums, songs } = await response.json();

  // Create maps for albums and tracks
  const albumMap = new Map(albums.map((album: SoundData) => [album.id, album]));
  const songMap = new Map(songs.map((song: SoundData) => [song.id, song]));

  // Attach album and track data to activity entries
  entries.forEach((entry) => {
    if (entry.sound_type === "albums")
      entry.sound_data = albumMap.get(entry.sound_apple_id) as SoundData;
    else if (entry.sound_type === "songs")
      entry.sound_data = songMap.get(entry.sound_apple_id) as SoundData;
  });

  return entries;
};
