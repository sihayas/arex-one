import axios from "axios";
import { AlbumData, UserData } from "../global/interfaces";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserSession {
  id: string;
  name: string;
  image: string;
  gender: string;
}

export async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/postAlbum`, album);
  return response.data;
}

export function useAlbumQuery(selectedAlbum: AlbumData | null) {
  return useQuery(
    ["album", selectedAlbum?.id],
    () =>
      selectedAlbum ? initializeAlbum(selectedAlbum) : Promise.resolve({}),
    {
      enabled: !!selectedAlbum,
    }
  );
}

export async function fetchReviews({
  pageParam = 1,
  queryKey,
  sort,
}: {
  pageParam?: number;
  queryKey: [string, string, string];
  sort: string;
}) {
  const [, albumId, userId] = queryKey;
  const response = await axios.get(
    `/api/album/getReviews?albumId=${albumId}&page=${pageParam}&sort=${sort}&userId=${userId}`
  );
  return response.data;
}

export function useReviewsQuery(
  selectedAlbum: AlbumData,
  user: UserSession,
  sortOrder: string
) {
  return useInfiniteQuery(
    ["reviews", selectedAlbum.id, user.id, sortOrder],
    ({ pageParam, queryKey }) =>
      fetchReviews({
        pageParam,
        queryKey: queryKey as [string, string, string],
        sort: sortOrder,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : false;
      },
      enabled: !!selectedAlbum,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        toast.success("loaded reviews");
      },
    }
  );
}
