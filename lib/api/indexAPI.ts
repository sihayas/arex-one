import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/musicKit";

// SPOTLIGHT ALBUMS
export const useFetchSpotlightAlbums = (page: number) => {
  // Grab spotlight albums from redis
  const spotlightAlbumsQuery = useQuery(["spotlightAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getSpotlightAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const spotlightAlbumsDataQuery = useQuery(
    ["albumDetails", spotlightAlbumsQuery.data || []],
    () => getAlbumsByIds(spotlightAlbumsQuery.data || []),
    {
      enabled: !!spotlightAlbumsQuery.data?.length,
    }
  );

  return { spotlightAlbumsQuery, spotlightAlbumsDataQuery };
};

// BLOOMING ALBUMS
export const useFetchBloomingAlbums = (page: number) => {
  // Grab blooming albums from redis
  const bloomingAlbumsQuery = useQuery(["bloomingAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getBloomingAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const bloomingAlbumsDataQuery = useQuery(
    ["albumDetails", bloomingAlbumsQuery.data || []],
    () => getAlbumsByIds(bloomingAlbumsQuery.data || []),
    {
      enabled: !!bloomingAlbumsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { bloomingAlbumsQuery, bloomingAlbumsDataQuery };
};
