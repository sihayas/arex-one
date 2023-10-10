import axios from "axios";
import { AlbumData } from "../global/interfaces";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAlbumById, getAlbumBySongId } from "../global/musicKit";
import { useSound } from "@/context/Sound";

interface UserSession {
  id: string;
  name: string;
  image: string;
  gender: string;
}

// Helper to update/create albums
async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/post/album`, album);
  return response.data;
}
// Fetch detailed album data on album page load
export function useAlbumQuery() {
  const { selectedSound, setSelectedSound } = useSound();

  return useQuery(
    ["album", selectedSound?.sound.id],
    async () => {
      if (selectedSound) {
        // If selected sound is a song, grab detailed album data to pass to Album page.
        if (selectedSound.sound.type === "songs") {
          const detailedAlbum = await getAlbumBySongId(selectedSound.sound.id);
          setSelectedSound({
            ...selectedSound,
            sound: detailedAlbum,
          });
          return initializeAlbum(detailedAlbum);
        }
        // If selected sound is an album without relationships, grab detailed album data.
        else if (selectedSound.sound.type === "albums") {
          const albumData = selectedSound.sound as AlbumData;

          if (!albumData.relationships) {
            const detailedAlbum = await getAlbumById(albumData.id);
            setSelectedSound({
              ...selectedSound,
              sound: detailedAlbum,
            });
            return initializeAlbum(detailedAlbum);
          }
        }
      }
      return Promise.resolve({});
    },
    {
      enabled: !!selectedSound,
    },
  );
}

// Helper function for fetching album reviews
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
    `/api/album/get/reviews?soundId=${soundId}&page=${pageParam}&sort=${sort}&userId=${userId}`,
  );
  return response.data;
}

// Main hook for fetching album reviews
export const useReviewsQuery = (
  soundId: string,
  user: UserSession,
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
      // onSuccess: (data) => {
      //   toast.success("loaded reviews");
      // },
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
