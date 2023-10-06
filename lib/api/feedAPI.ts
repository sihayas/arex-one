// This fetch function is used by react-query
import axios from "axios";
import { getAlbumsByIds } from "../global/musicKit";
import { ActivityData, AlbumData } from "../global/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
  limit: number = 6,
) => {
  const res = await axios.get(
    `/api/feed/get/activities?userId=${userId}&page=${pageParam}&limit=${limit}`,
  );

  // Check if res.data.data has the correct structure
  if (
    !res.data.data ||
    !res.data.data.activities ||
    !res.data.data.pagination
  ) {
    throw new Error("Unexpected server response structure");
  }

  const feedData = res.data.data.activities;

  // 2. Extract Album IDs
  const albumIds = feedData
    .filter((activity: ActivityData) => activity.type === "Review")
    .map((activity: ActivityData) => activity.review?.album.id);

  // 3. Fetch Album Details
  const albums = await getAlbumsByIds(albumIds);
  const albumMap = new Map<string, AlbumData>(
    albums.map((album: AlbumData) => [album.id, album]),
  );

  // 4. Append Album Details
  feedData.forEach((activity: ActivityData) => {
    // If activity is a review, append album details from Apple API response
    if (activity.review) {
      const albumId = activity.review.album.id;
      // Grab the relevant album from the albumMap and append it to the activity
      activity.review.appleAlbumData = <AlbumData>albumMap.get(albumId);
    }
  });

  return {
    data: feedData, // this is your activities data
    pagination: res.data.data.pagination, // this is your pagination data
  };
};

export const useFeedQuery = (userId: string | undefined, limit: number = 6) => {
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
//       const { data } = await axios.post("/api/review/getByIds", {
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
