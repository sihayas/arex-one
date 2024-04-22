import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { attachSoundData } from "@/lib/helper/feed";
import { EssentialExtended } from "@/types/global";
import { AlbumData } from "@/types/appleTypes";

export const useUserProfileQuery = (
  userId: string | undefined,
  pageUserId: string | undefined,
) => {
  return useQuery(
    ["userData", pageUserId],
    async () => {
      if (!userId || !pageUserId) return null;
      const response = await fetch(
        `/api/user/get/profile?userId=${userId}&pageUserId=${pageUserId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      data.essentials = JSON.parse(data.essentials);

      if (data.essentials.length) {
        const songIds: string[] = [];
        const albumIds = data.essentials.map(
          (essential: EssentialExtended) => essential.sound.apple_id,
        );

        const albumResponse = await fetch("/api/cache/sounds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ albums: albumIds, songs: songIds }),
        });

        if (!albumResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const { albums } = await albumResponse.json();

        const albumMap = new Map(
          albums.map((album: AlbumData) => [album.id, album]),
        );

        data.essentials.forEach((essential: EssentialExtended) => {
          essential.sound_data = albumMap.get(
            essential.sound.apple_id,
          ) as AlbumData;
        });
      }

      return data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
};

export const useEntriesQuery = (userId: string, pageUserId: string) => {
  return useInfiniteQuery(
    ["entries", userId],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        userId,
        pageUserId,
        page: pageParam.toString(),
      });

      const response = await fetch(
        `/api/user/get/entries?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const pagination = data.pagination;
      const entries = await attachSoundData(data.entries);

      return { data: entries, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage || null,
      enabled: !!userId && !!pageUserId,
      refetchOnWindowFocus: false,
    },
  );
};

export const followUser = async (userId: string, pageUserId: string) => {
  const response = await fetch(`/api/user/post/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, pageUserId }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};
