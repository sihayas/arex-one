import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

export const useFeedQuery = (userId: string, type: string, limit = 6) => {
  let url;

  if (type === "personal") {
    url = `/api/feed/get/personal`;
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
      const { data } = await axios.get(url, {
        params: { userId, page: pageParam, limit },
      });

      const { activities, pagination } = data.data;

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

// Helper function to extract artifact from activity
export function extractArtifact(activity: Activity) {
  return activity.type === ActivityType.Artifact
    ? activity.artifact
    : activity.type === ActivityType.ReplyType
      ? activity.reply?.artifact
      : activity.type === ActivityType.Heart
        ? activity.heart?.artifact || activity.heart?.reply?.artifact
        : null;
}

// Utility function to attach album and song data to activities
export const attachSoundData = async (activityData: Activity[]) => {
  const albumIds: string[] = [];
  const songIds: string[] = [];

  activityData.forEach((activity) => {
    const artifact = extractArtifact(activity);
    if (artifact) {
      const { type, appleId } = artifact.sound;
      if (type === "albums") albumIds.push(appleId);
      else if (type === "songs") songIds.push(appleId);
    }
  });

  // Fetch album and track data
  const idTypes = { albums: albumIds, songs: songIds };
  const response = await axios.get(`/api/cache/sounds`, {
    params: { idTypes: JSON.stringify(idTypes) },
  });
  const { albums, songs } = response.data;

  // Create maps for albums and tracks
  const albumMap = new Map(albums.map((album: AlbumData) => [album.id, album]));
  const songMap = new Map(songs.map((song: SongData) => [song.id, song]));

  // Attach album and track data to activity artifacts
  activityData.forEach((activity) => {
    const artifact = extractArtifact(activity);
    if (artifact) {
      const { type, appleId } = artifact.sound;
      if (type === "albums")
        artifact.sound.appleData = albumMap.get(appleId) as AlbumData;
      else if (type === "songs")
        artifact.sound.appleData = songMap.get(appleId) as SongData;
    }
  });

  return activityData;
};
