import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

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

      console.log("Merged data:", data);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

// Fetch profile feed
export const useFeedQuery = (userId: string, limit = 6) => {
  const { user } = useInterfaceContext();
  const isProfile = user?.id !== userId;
  const url = isProfile ? `/api/feed/get/profile` : `/api/feed/get/personal`;

  const result = useGenericFeedQuery("feed", url, userId, limit);

  return { ...result };
};

// Fetch ranked feed
export const useBloomingFeedQuery = (userId: string, limit = 6) => {
  const url = `/api/feed/get/bloom`;
  const result = useGenericFeedQuery("bloomingFeed", url, userId, limit);

  return { ...result };
};

// Fetch recently interacted feed
export const useRecentFeedQuery = (userId: string, limit = 6) => {
  const url = `/api/feed/get/recent`;
  const result = useGenericFeedQuery("recentRecords", url, userId, limit);

  return { ...result };
};

function extractArtifact(activity: Activity) {
  return activity.type === ActivityType.Artifact
    ? activity.artifact
    : activity.type === ActivityType.ReplyType
    ? activity.reply?.artifact
    : activity.type === ActivityType.Heart
    ? activity.heart?.artifact
    : null;
}

// Utility function to attach album and track data to activities
const attachSoundData = async (activityData: Activity[]) => {
  const albumIds: string[] = [];
  const trackIds: string[] = [];

  activityData.forEach((activity) => {
    const artifact = extractArtifact(activity);
    if (artifact) {
      const { type, appleId } = artifact.sound;
      if (type === "albums") albumIds.push(appleId);
      else if (type === "songs") trackIds.push(appleId);
    }
  });

  // Fetch album and track data
  const idTypes = { albums: albumIds, songs: trackIds };
  const response = await axios.get(`/api/sounds/get/sounds`, {
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
        artifact.appleData = albumMap.get(appleId) as AlbumData;
      else if (type === "songs")
        artifact.appleData = songMap.get(appleId) as SongData;
    }
  });

  console.log(activityData);

  return activityData;
};
