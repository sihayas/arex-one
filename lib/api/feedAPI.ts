import axios from "axios";
import { getAnyByIds } from "../global/musicKit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData } from "@/types/appleTypes";

const fetchFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
  limit: number = 6,
) => {
  const res = await axios.get(`/api/feed/get/activities`, {
    params: {
      userId,
      page: pageParam,
      limit,
    },
  });

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
  const albums = await getAnyByIds({
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
    data: feedData, // this is your activities data
    pagination: res.data.data.pagination, // this is your pagination data
  };
};

export const useFeedQuery = (userId: string, limit: number = 6) => {
  const result = useInfiniteQuery(
    ["feed", userId],
    ({ pageParam = 1 }) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return fetchFeedAndMergeAlbums(userId, pageParam, limit);
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

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// export const useFetchBloomingEntries = (page: number) => {
//   // Grab blooming entries from redis
//   const bloomingEntriesQuery = useQuery(["bloomingEntries", page], async () => {
//     const { data } = await axios.get(
//       `/api/index/get/bloomingEntries?page=${page}`,
//     );
//     return data;
//   });
//
//   // Pull review data from DB with ID
//   const bloomingEntriesDataQuery = useQuery(
//     ["entryDetails", bloomingEntriesQuery.data || []],
//     async () => {
//       const { data } = await axios.post("/api/record/entry/getByIds", {
//         ids: bloomingEntriesQuery.data,
//       });
//       return data;
//     },
//     {
//       enabled: !!bloomingEntriesQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
//     },
//   );
//
//   return { bloomingEntriesQuery, bloomingEntriesDataQuery };
// };

// To call above function:
// const { bloomingEntriesQuery, bloomingEntriesDataQuery } =
//   useFetchBloomingEntries(page);
