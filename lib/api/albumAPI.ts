import axios from "axios";
import { AlbumData } from "../global/interfaces";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAlbumById } from "../global/musicKit";

interface UserSession {
  id: string;
  name: string;
  image: string;
  gender: string;
}

export async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/post/album`, album);
  return response.data;
}
export function useAlbumQuery(selectedAlbum: AlbumData | null) {
  return useQuery(
    ["album", selectedAlbum?.id],
    async () => {
      if (selectedAlbum) {
        // If relationships attribute doesn't exist, fetch detailed info
        if (!selectedAlbum.relationships) {
          const detailedAlbum = await getAlbumById(selectedAlbum.id);
          return initializeAlbum(detailedAlbum);
        }
        return initializeAlbum(selectedAlbum);
      }
      return Promise.resolve({});
    },
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
    `/api/album/get/reviews?albumId=${albumId}&page=${pageParam}&sort=${sort}&userId=${userId}`
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
