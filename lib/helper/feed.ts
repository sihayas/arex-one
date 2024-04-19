import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

export const useFeedQuery = (userId: string, type: string, limit = 6) => {
  let url;

  if (type === "personal") {
    url = `/api/user/get/feed`;
  } else if (type === "bloom") {
    url = `/api/feed/get/bloom`;
  } else if (type === "recent") {
    url = `/api/feed/get/recent`;
  }

  if (!url) throw new Error("Invalid type passed to useTestQuery");

  const result = useGenericFeedQuery("feed", url, userId, limit);

  return { ...result };
};

// Common logic for fetching feed data
const useGenericFeedQuery = (
  key: string,
  url: string,
  userId: string,
  limit: number,
) => {
  return useInfiniteQuery(
    [key, userId],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        userId,
        page: pageParam.toString(),
      });
      const response = await fetch(`${url}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      const { activities, pagination } = jsonData.data;

      if (!activities || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

// Helper function to extract entry from activity
export function extractEntry(activity: Activity) {
  return activity.type === ActivityType.Entry
    ? activity.entry
    : activity.type === ActivityType.ReplyType
    ? activity.reply?.entry
    : activity.type === ActivityType.Heart
    ? activity.heart?.entry || activity.heart?.reply?.entry
    : null;
}

// Utility function to attach album and song data to activities
export const attachSoundData = async (activityData: Activity[]) => {
  const albumIds: string[] = [];
  const songIds: string[] = [];

  activityData.forEach((activity) => {
    const entry = extractEntry(activity);
    if (entry) {
      const { type, appleId } = entry.sound;
      if (type === "albums") albumIds.push(appleId);
      else if (type === "songs") songIds.push(appleId);
    }
  });

  // Fetch album and track data
  const idTypes = { albums: albumIds, songs: songIds };
  const url = new URL(`/api/cache/sounds`, location.origin);
  url.searchParams.append("idTypes", JSON.stringify(idTypes));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const { albums, songs } = await response.json();

  // Create maps for albums and tracks
  const albumMap = new Map(albums.map((album: AlbumData) => [album.id, album]));
  const songMap = new Map(songs.map((song: SongData) => [song.id, song]));

  // Attach album and track data to activity entries
  activityData.forEach((activity) => {
    const entry = extractEntry(activity);
    if (entry) {
      const { type, appleId } = entry.sound;
      if (type === "albums")
        entry.sound.appleData = albumMap.get(appleId) as AlbumData;
      else if (type === "songs")
        entry.sound.appleData = songMap.get(appleId) as SongData;
    }
  });

  return activityData;
};
