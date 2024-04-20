import { useInfiniteQuery } from "@tanstack/react-query";
import { AlbumData, SongData } from "@/types/appleTypes";
import { EntryExtended } from "@/types/global";

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
    if (entry.sound_type === "albums")
      entry.sound_data = albumMap.get(entry.sound_apple_id) as AlbumData;
    else if (entry.sound_type === "songs")
      entry.sound_data = songMap.get(entry.sound_apple_id) as SongData;
  });

  return entries;
};

interface Entry {
  id: string;
  sound: { id: string; apple_id: string; type: string };
  type: string;
  author_id: string;
  text: string | null;
  created_at: Date;
  _count: { actions: number; chains: number };
  rating: number | null;
  loved: boolean | null;
  replay: boolean | null;
}

export const formatEntry = (entry: Entry) => {
  return {
    id: entry.id,
    sound_id: entry.sound.id,
    sound_apple_id: entry.sound.apple_id,
    sound_type: entry.sound.type,
    type: entry.type,
    author_id: entry.author_id,
    text: entry.text,
    created_at: entry.created_at.toISOString(),
    actions_count: entry._count.actions,
    chains_count: entry._count.chains,
    // Extra fields for artifacts
    rating: entry.rating,
    loved: entry.loved,
    replay: entry.replay,
  };
};
