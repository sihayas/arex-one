import axios from "axios";
import { SelectedSound, AlbumData, SongData } from "../global/interfaces";
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

export async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/post/album`, album);
  return response.data;
}
// Fetch detailed album data
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
  const [, soundId, userId] = queryKey;
  const response = await axios.get(
    `/api/album/get/reviews?soundId=${soundId}&page=${pageParam}&sort=${sort}&userId=${userId}`
  );
  return response.data;
}

export function useReviewsQuery(
  soundId: string,
  user: UserSession,
  sortOrder: string
) {
  return useInfiniteQuery(
    ["reviews", soundId, user.id, sortOrder],
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
      enabled: !!soundId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        toast.success("loaded reviews");
      },
    }
  );
}
