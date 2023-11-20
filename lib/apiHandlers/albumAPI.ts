import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";
import { User } from "@/types/dbTypes";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchSoundsByType } from "../global/musicKit";
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

// Fetch detailed album data on album page if necessary and mark as viewed.
export function useAlbumQuery() {
  const { selectedSound, setSelectedSound } = useSound();
  const { user } = useInterfaceContext();

  return useQuery(["album", selectedSound?.sound.id], async () => {
    if (
      !selectedSound ||
      !user ||
      !["songs", "albums"].includes(selectedSound.sound.type)
    ) {
      return {};
    }

    let sound = selectedSound.sound;
    // Get detailed album data if necessary
    if (
      sound.type === "songs" ||
      (sound.type === "albums" && !sound.relationships)
    ) {
      const ids =
        sound.type === "songs"
          ? (sound as SongData).relationships.albums.data
              .map((album) => album.id)
              .join(",")
          : sound.id;

      const response = await axios.get(`/api/sounds/get/cachedAlbum`, {
        params: { ids: ids },
      });

      [sound] = response.data;
    }

    setSelectedSound({ ...selectedSound, sound });
    return initializeAlbum(sound as AlbumData, user.id);
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
