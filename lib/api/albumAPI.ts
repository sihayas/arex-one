import axios from "axios";
import { AlbumData, UserData } from "../interfaces";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/postAlbum`, album);
  return response.data;
}

export async function fetchReviews({
  pageParam = 1,
  queryKey,
  sort = "rating_high_to_low",
}: {
  pageParam?: number;
  queryKey: [string, string | undefined, string | undefined];
  sort?: string;
}) {
  const [, albumId, userId] = queryKey;
  const response = await axios.get(
    `/api/album/getReviews?albumId=${albumId}&page=${pageParam}&sort=${sort}&userId=${userId}`
  );
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

export function useReviewsQuery(selectedAlbum: AlbumData, user: UserData) {
  return useInfiniteQuery(
    ["reviews", selectedAlbum?.id, user?.id],
    fetchReviews,
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
