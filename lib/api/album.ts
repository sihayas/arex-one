import axios from "axios";
import { UserType } from "@/types/dbTypes";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSoundContext } from "@/context/SoundContext";

// React Query hook for fetching album reviews
export const useArtifactsQuery = (
  soundId: string,
  userId: string | undefined,
  sortOrder: string,
) =>
  useInfiniteQuery(
    ["reviews", soundId],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/album/get/artifacts`, {
        params: { soundId, page: pageParam, sort: sortOrder, userId },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 10 ? pages.length + 1 : false,
      enabled: !!soundId,
      refetchOnWindowFocus: false,
    },
  );

// Helper for loading album page data
export function useAlbumQuery() {
  const { selectedSound, setSelectedSound } = useSoundContext();

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

// // Helper to update/create albums and add view.
// const initializeAlbum = async (album: AlbumData, userId: string) => {
//   const requestBody = {
//     album,
//     userId,
//   };
//   const res = await axios.post(`/api/album/post/album`, requestBody);
//   return res.data;
// };
