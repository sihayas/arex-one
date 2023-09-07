// This fetch function is used by react-query
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "../global/musicKit";
import { ActivityData, AlbumData } from "../global/interfaces";

export const fetchFeedAndMergeAlbums = async (
  userId: string,
  page: number = 1
) => {
  const feedData = await fetchFeed(userId, page);

  // 2. Extract Album IDs
  const albumIds = feedData
    .filter((activity: ActivityData) => activity.type === "Review")
    .map((activity: ActivityData) => activity.review?.albumId);

  // 3. Fetch Album Details
  const albums = await getAlbumsByIds(albumIds);
  const albumMap = new Map(albums.map((album: AlbumData) => [album.id, album]));

  // 4. Append Album Details
  feedData.forEach((activity) => {
    if (activity.type === "Review" && activity.review.albumId) {
      const albumId = activity.review.albumId;
      activity.review.appleAlbumData = albumMap.get(albumId);
    }
  });

  console.log(feedData);
  return feedData;
};

export const fetchFeed = async (userId: string, page: number = 1) => {
  const res = await axios.get(
    `/api/feed/get/activities?userId=${userId}&page=${page}`
  );
  console.log(res.data);
  return res.data;
};

export const useFetchBloomingEntries = (page: number) => {
  // Grab blooming entries from redis
  const bloomingEntriesQuery = useQuery(["bloomingEntries", page], async () => {
    const { data } = await axios.get(
      `/api/index/get/bloomingEntries?page=${page}`
    );
    return data;
  });

  // Pull review data from DB with ID
  const bloomingEntriesDataQuery = useQuery(
    ["entryDetails", bloomingEntriesQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: bloomingEntriesQuery.data,
      });
      return data;
    },
    {
      enabled: !!bloomingEntriesQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { bloomingEntriesQuery, bloomingEntriesDataQuery };
};

// To call above function:
// const { bloomingEntriesQuery, bloomingEntriesDataQuery } =
//   useFetchBloomingEntries(page);
