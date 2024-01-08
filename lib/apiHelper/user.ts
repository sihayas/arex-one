import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { attachSoundData } from "@/lib/apiHelper/feed";
import { Artifact } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

export const followUser = async (followerId: string, followingId: string) => {
  await axios.post(`/api/user/post/follow`, { followerId, followingId });
  return { followingAtoB: true };
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  await axios.delete(`/api/user/post/unfollow`, {
    params: {
      unfollowerId: followerId,
      unfollowingId: followingId,
    },
  });
  return { followingAtoB: false };
};

// Get user data, handle follow/unfollow, and fetch favorites
export const useUserDataQuery = (
  sessionUserId: string | undefined,
  pageUserId: string | undefined,
) => {
  const [followState, setFollowState] = useState({
    followingAtoB: null as boolean | null,
    followingBtoA: null as boolean | null,
    loadingFollow: false,
  });

  const handleFollowUnfollow = async (action: "follow" | "unfollow") => {
    if (!sessionUserId || !pageUserId) return;
    const newState =
      action === "follow"
        ? await followUser(sessionUserId, pageUserId)
        : await unfollowUser(sessionUserId, pageUserId);
    setFollowState((prevState) => ({ ...prevState, ...newState }));
  };

  const { data, isLoading, isError } = useQuery(
    ["userData", pageUserId],
    async () => {
      if (!sessionUserId || !pageUserId) return null;
      const { data: userData } = await axios.get(`/api/user/get/byId`, {
        params: { sessionUserId, pageUserId },
      });
      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: userData.isFollowingAtoB,
        followingBtoA: userData.isFollowingBtoA,
      }));
      return { userData };
    },
  );

  return { data, isLoading, isError, followState, handleFollowUnfollow };
};

export const useUserSettingsQuery = (userId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["userSettings", userId],
    async () => {
      const response = await axios.get(`/api/user/get/settings`, {
        params: {
          userId,
        },
      });
      return response.data;
    },
  );

  return { data, isLoading, isError };
};

export const useEntriesQuery = (userId: string) => {
  return useInfiniteQuery(
    ["entries", userId],
    async ({ pageParam = 1 }) => {
      const url = `/api/user/get/entries`;
      const { data } = await axios.get(url, {
        params: {
          userId,
          page: pageParam,
          limit: 8,
        },
      });

      const { activities, pagination } = data.data;

      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

export const useSoundsQuery = (userId: string) => {
  return useInfiniteQuery(
    ["sounds", userId],
    async ({ pageParam = 1 }) => {
      const url = `/api/user/get/sounds`;
      const { data } = await axios.get(url, {
        params: {
          userId,
          page: pageParam,
          limit: 8,
        },
      });

      const { artifacts, pagination } = data.data;

      const mergedData = await attachSoundDataToArtifacts(artifacts);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

export const useWispsQuery = (userId: string) => {
  return useInfiniteQuery(
    ["wisps", userId],
    async ({ pageParam = 1 }) => {
      const url = `/api/user/get/wisps`;
      const { data } = await axios.get(url, {
        params: {
          userId,
          page: pageParam,
          limit: 8,
        },
      });

      const { activities, pagination } = data.data;

      const mergedData = await attachSoundData(activities);

      return { data: mergedData, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    },
  );
};

export const useNotificationsQuery = (userId: string | undefined) => {
  return useQuery(
    ["notifications", userId],
    async () => {
      const { data } = await axios.get(`/api/user/get/notifications`, {
        params: { userId },
      });

      const { notifications } = data.data;
      if (!notifications) {
        throw new Error("Unexpected server response structure");
      }

      // Collect first activities and directly attach sound data
      const firstActivities = Object.values(notifications).reduce(
        (acc, group) => {
          //@ts-ignore
          if (group.notifications.length > 0) {
            //@ts-ignore
            acc.push(group.notifications[0].activity);
          }
          return acc;
        },
        [],
      );

      //@ts-ignore
      const updatedActivities = await attachSoundData(firstActivities);

      // Directly reattach updated activities to their respective notifications
      let updateIndex = 0;
      for (const group of Object.values(notifications)) {
        //@ts-ignore
        if (group.notifications.length > 0) {
          //@ts-ignore
          group.notifications[0].activity = updatedActivities[updateIndex++];
        }
      }

      return { data: notifications };
    },
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
};

export const changeEssential = async (
  userId: string,
  prevEssentialId: string | null,
  appleId: string,
  rank: number,
) => {
  const url = `/api/user/post/changeEssential`;
  return axios.post(url, {
    userId,
    prevEssentialId,
    appleId,
    rank,
  });
};

export const toggleSetting = async (
  userId: string,
  settingKey:
    | "followerNotifications"
    | "replyNotifications"
    | "heartNotifications",
) => {
  const url = `/api/user/post/toggleSetting`;
  return axios.post(url, {
    userId,
    settingKey,
  });
};

export const changeBio = async (userId: string, bio: string) => {
  const url = `/api/user/post/changeBio`;
  return axios.post(url, {
    userId,
    bio,
  });
};

export const attachSoundDataToArtifacts = async (artifacts: Artifact[]) => {
  const albumIds: string[] = [];
  const songIds: string[] = [];

  // Loop through each artifact to collect album and song IDs
  artifacts.forEach((artifact) => {
    const { type, appleId } = artifact.sound;
    if (type === "albums") albumIds.push(appleId);
    else if (type === "songs") songIds.push(appleId);
  });

  // Fetch album and track data
  const idTypes = { albums: albumIds, songs: songIds };
  const response = await axios.get(`/api/caches/sounds`, {
    params: { idTypes: JSON.stringify(idTypes) },
  });
  const { albums, songs } = response.data;

  // Create maps for albums and tracks
  const albumMap = new Map(albums.map((album: AlbumData) => [album.id, album]));
  const songMap = new Map(songs.map((song: SongData) => [song.id, song]));

  // Attach album and track data to artifacts
  artifacts.forEach((artifact) => {
    const { type, appleId } = artifact.sound;
    if (type === "albums")
      artifact.appleData = albumMap.get(appleId) as AlbumData;
    else if (type === "songs")
      artifact.appleData = songMap.get(appleId) as SongData;
  });

  return artifacts;
};
