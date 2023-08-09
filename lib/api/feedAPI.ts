// This fetch function is used by react-query
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchFeed = async (userId: string) => {
  const res = await axios.get(`/api/feed/getActivities?userId=${userId}`);
  return res.data;
};

export const useFetchSpotlightEntries = (page: number) => {
  // Grab spotlight entries from redis
  const spotlightEntriesQuery = useQuery(
    ["spotlightEntries", page],
    async () => {
      const { data } = await axios.get(
        `/api/index/getSpotlightEntries?page=${page}`
      );
      return data;
    }
  );

  // Pull review data from DB with ID
  const spotlightEntriesDataQuery = useQuery(
    ["entryDetails", spotlightEntriesQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: spotlightEntriesQuery.data,
      });
      return data;
    },
    {
      enabled: !!spotlightEntriesQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { spotlightEntriesDataQuery, spotlightEntriesQuery };
};

export const useFetchBloomingEntries = (page: number) => {
  // Grab blooming entries from redis
  const bloomingEntriesQuery = useQuery(["bloomingEntries", page], async () => {
    const { data } = await axios.get(
      `/api/index/getBloomingEntries?page=${page}`
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
