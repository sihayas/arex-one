import axios from "axios";
import { fetchSoundsByTypes } from "../global/musicKit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

// Fetch a users personal feed
export const useFeedQuery = (userId: string, limit: number = 6) => {
  const { user } = useInterfaceContext();

  // Check if grabbing profile records or user feed
  const isProfile = user?.id !== userId;

  const result = useInfiniteQuery(
    ["feed", userId],
    ({ pageParam = 1 }) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return fetchFeedAndMergeAlbums(
        userId,
        pageParam,
        limit,
        isProfile,
        user?.id,
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const lastPageData = allPages[allPages.length - 1];
        return lastPageData.pagination?.nextPage || null;
      },
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

const fetchFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
  limit: number = 6,
  isProfile: boolean = false,
  authUserId?: string,
) => {
  const url = isProfile
    ? `/api/feed/get/profileRecords`
    : `/api/feed/get/activities`;

  const params = {
    userId,
    page: pageParam,
    limit,
    ...(isProfile && authUserId && { authUserId }),
  };

  const res = await axios.get(url, { params });

  // Check if res.data.data has the correct structure
  if (
    !res.data.data ||
    !res.data.data.activities ||
    !res.data.data.pagination
  ) {
    throw new Error("Unexpected server response structure");
  }

  const feedData = res.data.data.activities;

  // 2. Group Records by Type
  const albumIds: string[] = [];
  const trackIds: string[] = [];
  feedData.forEach((activity: Activity) => {
    if (activity.record && activity.type === ActivityType.RECORD) {
      if (activity.record.album) {
        albumIds.push(activity.record.album.appleId);
      }
      if (activity.record.track) {
        trackIds.push(activity.record.track.appleId);
      }
    }
  });

  // 3. Fetch Album Details
  const albums = await fetchSoundsByTypes({
    albums: albumIds,
    songs: trackIds,
  });

  // Create a map for easy lookup
  const albumMap = new Map<string, AlbumData>(
    albums.map((album: AlbumData) => [album.id, album]),
  );

  // 4. Append Album Details
  feedData.forEach((activity: Activity) => {
    // If activity is a record, append album details from albumMap
    if (activity.type === ActivityType.RECORD && activity.record) {
      const albumId = activity.record.album?.appleId;
      const trackId = activity.record.track?.appleId;
      if (albumId) {
        activity.record.appleAlbumData = <AlbumData>albumMap.get(albumId);
      } else if (trackId) {
        // Assuming track ID can be used as a key to fetch album data
        activity.record.appleAlbumData = <AlbumData>albumMap.get(trackId);
      }
    }
  });

  return {
    data: feedData,
    pagination: res.data.data.pagination,
  };
};

// Fetch basic periodically ranked feed
export const useBloomingFeedQuery = (userId: string, limit: number = 6) => {
  const result = useInfiniteQuery(
    ["bloomingFeed", userId],
    ({ pageParam = 1 }) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return fetchBloomingFeedAndMergeAlbums(userId, pageParam, limit);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const lastPageData = allPages[allPages.length - 1];
        return lastPageData.pagination?.nextPage || null;
      },
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

const fetchBloomingFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
  limit: number = 6,
) => {
  const url = `/api/scores/get/bloomingEntries`;
  const dataUrl = `/api/feed/get/trendingActivities`;

  const params = {
    userId,
    page: pageParam,
    limit,
  };

  // Get trending record entry activity ids from Redis
  const res = await axios.get(url, { params });

  // Check if res.data.data has the correct structure
  if (!res.data.data || !res.data.data.entries || !res.data.data.pagination) {
    throw new Error("Unexpected server response structure");
  }

  const activityIds = res.data.data.entries;
  const activityIdsParam = activityIds.join(",");

  // Get the activity.record data for returned list of activity ids
  const response = await axios.get(dataUrl, {
    params: {
      ids: activityIdsParam,
      userId,
    },
  });

  const activityData = response.data;

  // 2. Group Records by Type
  const albumIds: string[] = [];
  const trackIds: string[] = [];
  activityData.forEach((activity: Activity) => {
    if (activity.record && activity.type === ActivityType.RECORD) {
      if (activity.record.album) {
        albumIds.push(activity.record.album.appleId);
      }
      if (activity.record.track) {
        trackIds.push(activity.record.track.appleId);
      }
    }
  });

  // 3. Fetch Album Details
  const albums = await fetchSoundsByTypes({
    albums: albumIds,
    songs: trackIds,
  });

  // Create a map for easy lookup
  const albumMap = new Map<string, AlbumData>(
    albums.map((album: AlbumData) => [album.id, album]),
  );

  // 4. Append Album Details
  activityData.forEach((activity: Activity) => {
    // If activity is a record, append album details from albumMap
    if (activity.type === ActivityType.RECORD && activity.record) {
      const albumId = activity.record.album?.appleId;
      const trackId = activity.record.track?.appleId;
      if (albumId) {
        activity.record.appleAlbumData = <AlbumData>albumMap.get(albumId);
      } else if (trackId) {
        // Assuming track ID can be used as a key to fetch album data
        activity.record.appleAlbumData = <AlbumData>albumMap.get(trackId);
      }
    }
  });

  return {
    data: activityData,
    pagination: res.data.data.pagination,
  };
};

// Fetch recently interacted with records
export const useRecentFeedQuery = (userId: string, limit: number = 6) => {
  const result = useInfiniteQuery(
    ["recentRecords", userId],
    ({ pageParam = 1 }) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return fetchRecentFeedAndMergeAlbums(userId, pageParam, limit);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const lastPageData = allPages[allPages.length - 1];
        return lastPageData.pagination?.nextPage || null;
      },
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

const fetchRecentFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
  limit: number = 6,
) => {
  const url = `/api/feed/get/recentActivities`;

  const params = {
    userId,
    page: pageParam,
    limit,
  };

  const res = await axios.get(url, { params });

  // Check if res.data.data has the correct structure
  if (
    !res.data.data ||
    !res.data.data.activities ||
    !res.data.data.pagination
  ) {
    throw new Error("Unexpected server response structure");
  }

  const activityData = res.data.data.activities;

  // 2. Group Records by Type
  const albumIds: string[] = [];
  const trackIds: string[] = [];
  activityData.forEach((activity: Activity) => {
    const record = extractRecordFromActivity(activity);
    if (record?.album) {
      albumIds.push(record.album.appleId);
    }
    if (record?.track) {
      trackIds.push(record.track.appleId);
    }
  });

  // 3. Fetch Album Details
  const albums = await fetchSoundsByTypes({
    albums: albumIds,
    songs: trackIds,
  });

  // Create a map for easy lookup
  const albumMap = new Map<string, AlbumData>(
    albums.map((album: AlbumData) => [album.id, album]),
  );

  // 4. Append Album Details
  activityData.forEach((activity: Activity) => {
    const record = extractRecordFromActivity(activity);
    if (record) {
      const albumId = record.album?.appleId;
      const trackId = record.track?.appleId;
      if (albumId) record.appleAlbumData = <AlbumData>albumMap.get(albumId);
      else if (trackId)
        record.appleAlbumData = <AlbumData>albumMap.get(trackId);
    }
  });

  return {
    data: activityData,
    pagination: res.data.data.pagination,
  };
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
