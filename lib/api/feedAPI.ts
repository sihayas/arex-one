// This fetch function is used by react-query
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "../global/musicKit";
import { ActivityData, AlbumData } from "../global/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchFeedAndMergeAlbums = async (
  userId: string,
  pageParam: number = 1,
) => {
  const feedData = await fetchFeed(userId, pageParam);

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

  return feedData;
};

export const fetchFeed = async (userId: string, pageParam: number = 1) => {
  const res = await axios.get(
    `/api/feed/get/activities?userId=${userId}&page=${pageParam}`,
  );
  return res.data;
};

export const useFeedQuery = (userId: string | undefined) => {
  const result = useInfiniteQuery(
    ["feed", userId],
    ({ pageParam = 1 }) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return fetchFeedAndMergeAlbums(userId, pageParam);
    },
    {
      getNextPageParam: (lastPage, pages) => pages.length,
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
