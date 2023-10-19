import axios from "axios";
import { AlbumData, SongData } from "@/types/appleTypes";
import { User } from "@/types/dbTypes";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchSoundsbyType } from "../global/musicKit";
import { useSound } from "@/context/SoundContext";
import { useInterfaceContext } from "@/context/InterfaceContext";

// React Query hook for fetching album reviews
export const useReviewsQuery = (
  soundId: string,
  user: User,
  sortOrder: string
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
    }
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
  const response = await axios.get(
    `/api/album/get/reviews?soundId=${soundId}&page=${pageParam}&sort=${sort}&userId=${userId}`
  );
  return response.data;
}

// Fetch detailed album data on album page if necessary and mark as viewed.
export function useAlbumQuery() {
  const { selectedSound, setSelectedSound } = useSound();
  const { user, pages, setPages } = useInterfaceContext();

  return useQuery(["album", selectedSound?.sound.id], async () => {
    if (
      selectedSound &&
      user &&
      ["songs", "albums"].includes(selectedSound.sound.type)
    ) {
      let soundData = selectedSound.sound as AlbumData | SongData;

      // If the sound is a song or an album without relationships, fetch more detailed album data
      if (
        soundData.type === "songs" ||
        (soundData.type === "albums" && !soundData.relationships)
      ) {
        const id =
          soundData.type === "songs"
            ? (soundData as SongData).relationships.albums.data[0].id
            : soundData.id;
        const sounds = await fetchSoundsbyType("albums", [id]);
        soundData = sounds[0];
      }

      setSelectedSound({ ...selectedSound, sound: soundData });

      return initializeAlbum(soundData as AlbumData, user.id);
    }

    return Promise.resolve({});
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
