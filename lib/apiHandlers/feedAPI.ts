import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

// Fetch users personal feed
export const useFeedQuery = (userId: string, limit: number = 6) => {
  const { user } = useInterfaceContext();
  const isProfile = user?.id !== userId;
  const url = isProfile
    ? `/api/feed/get/profileRecords`
    : `/api/feed/get/personalActivities`;

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
      const { data } = await axios.get(`/api/feed/get/recentActivities`, {
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

// Utility function to attach album and track data to activities
const attachSoundData = async (activityData: Activity[]) => {
  const albumIds: string[] = [];
  const trackIds: string[] = [];

  // Extract album and track IDs
  activityData.forEach((activity) => {
    const record = extractRecordFromActivity(activity);
    if (record?.album) albumIds.push(record.album.appleId);
    if (record?.track) trackIds.push(record.track.appleId);
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

  // Attach album and track data to activity records
  activityData.forEach((activity) => {
    const record = extractRecordFromActivity(activity);
    if (record) {
      const albumId = record.album?.appleId;
      const trackId = record.track?.appleId;
      if (albumId) record.appleAlbumData = albumMap.get(albumId) as AlbumData;
      if (trackId) record.appleTrackData = songMap.get(trackId) as SongData;
    }
  });

  console.log(activityData);

  return activityData;
};

function extractRecordFromActivity(activity: Activity) {
  switch (activity.type) {
    case ActivityType.RECORD:
      return activity.record;
    case ActivityType.REPLY:
      return activity.reply?.record;
    case ActivityType.HEART:
      return activity.heart?.record;
    default:
      return null;
  }
}
