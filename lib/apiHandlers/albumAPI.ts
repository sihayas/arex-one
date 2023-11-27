import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";
import { User } from "@/types/dbTypes";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSound } from "@/context/SoundContext";
import { useInterfaceContext } from "@/context/InterfaceContext";

// React Query hook for fetching album reviews
export const useReviewsQuery = (
  soundId: string,
  user: User,
  sortOrder: string,
) => {
  const result = useInfiniteQuery(
    ["reviews", soundId, user.id, sortOrder],
    ({ pageParam = 1 }) =>
      fetchReviews({
        pageParam,
        soundId,
        userId: user.id,
        sort: sortOrder,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : false;
      },
      enabled: !!soundId,
      refetchOnWindowFocus: false,
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

// Helper function for fetching album reviews with axios
export async function fetchReviews({
  pageParam = 1,
  soundId,
  userId,
  sort,
}: {
  pageParam?: number;
  soundId: string;
  userId: string;
  sort: string;
}) {
  const response = await axios.get(`/api/album/get/records`, {
    params: {
      soundId,
      page: pageParam,
      sort,
      userId,
    },
  });
  return response.data;
}

// Helper for loading album page data
export function useAlbumQuery() {
  const { selectedSound, setSelectedSound } = useSound();

  return useQuery(["album", selectedSound?.sound.id], async () => {
    const shouldFetch =
      selectedSound &&
      (selectedSound.sound.type === "songs" ||
        !selectedSound.sound.relationships);

    if (!shouldFetch) return selectedSound?.sound || null;

    const response = await axios.get(`/api/sounds/get/sound`, {
      params: { ids: selectedSound.sound.id, type: selectedSound.sound.type },
    });

    const updatedSound = response.data[0];
    setSelectedSound({ ...selectedSound, sound: updatedSound });

    return updatedSound;
  });
}

// Helper to update/create albums and add view.
const initializeAlbum = async (album: AlbumData, userId: string) => {
  const requestBody = {
    album,
    userId,
  };
  const res = await axios.post(`/api/album/post/album`, requestBody);
  return res.data;
};
