import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

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
// Fetch users personal feed
export const useFeedQuery = (userId: string, limit: number = 6) => {
  const { user } = useInterfaceContext();
  const isProfile = user?.id !== userId;
  const url = isProfile ? `/api/feed/get/profile` : `/api/feed/get/user`;

  const result = useInfiniteQuery(
    ["feed", userId],
    async ({ pageParam = 1 }) => {
      const params = {
        userId,
        page: pageParam,
        limit,
        ...(isProfile && user?.id && { authUserId: user.id }),
      };

      const { data } = await axios.get(url, { params });
      const { activities, pagination } = data.data;

      if (!activities || !pagination)
        throw new Error("Unexpected server response structure");

      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: result.data,
    error: result.error,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

// Fetch ranked feed
export const useBloomingFeedQuery = (userId: string, limit: number = 6) => {
  const result = useInfiniteQuery(
    ["bloomingFeed", userId],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/feed/get/bloomingActivities`, {
        params: { userId, page: pageParam, limit },
      });

      const { activities, pagination } = data.data;
      if (!activities || !pagination)
        throw new Error("Unexpected server response structure");

      // Attach album and track data to activities
      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: result.data,
    error: result.error,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

// Fetch recently interacted feed
export const useRecentFeedQuery = (userId: string, limit: number = 6) => {
  const result = useInfiniteQuery(
    ["recentRecords", userId],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/feed/get/recent`, {
        params: { userId, page: pageParam, limit },
      });

      const { activities, pagination } = data.data;
      if (!activities || !pagination)
        throw new Error("Unexpected server response structure");

      // Attach album and track data to activities
      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: result.data,
    error: result.error,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

function extractArtifact(activity: Activity) {
  switch (activity.type) {
    case ActivityType.Artifact:
      return activity.artifact;
    case ActivityType.Reply:
      return activity.reply?.artifact;
    case ActivityType.Heart:
      return activity.heart?.artifact;
    default:
      return null;
  }
}
