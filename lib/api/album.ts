import axios from "axios";
import { Activity, UserType } from "@/types/dbTypes";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSoundContext } from "@/context/SoundContext";
import { AlbumData } from "@/types/appleTypes";

// React Query hook for fetching album reviews
export const useArtifactsQuery = (
  sound: AlbumData,
  userId: string | undefined,
  sort: string,
) =>
  useInfiniteQuery(
    ["artifacts", sound],
    async ({ pageParam = 1 }) => {
      const url = `/api/album/get/artifacts`;
      const { data } = await axios.get(url, {
        params: { soundId: sound.id, page: pageParam, sort, userId, limit: 6 },
      });
      const { activities, pagination } = data.data;

      if (!activities || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      return { data: activities, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
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
