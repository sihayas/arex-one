import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { attachSoundData } from "@/lib/apiHelper/feed";

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

export const useSoundtrackQuery = (userId: string) => {
  return useInfiniteQuery(
    ["soundtrack", userId],
    async ({ pageParam = 1 }) => {
      const url = `/api/user/get/soundtrack`;
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
  return useInfiniteQuery(
    ["notifications", userId],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/user/get/notifications`, {
        params: { userId, page: pageParam, limit: 6 },
      });

      const { notifications, pagination } = data.data;

      if (!notifications || !pagination) {
        throw new Error("Unexpected server response structure");
      }

      // const mergedData = await attachSoundData(notifications);

      console.log("notifications", notifications);
      return { data: notifications, pagination };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination?.nextPage || null,
      enabled: !!userId,
      refetchOnWindowFocus: false,
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
  const response = await axios.post(url, {
    userId,
    prevEssentialId,
    appleId,
    rank,
  });
  return response;
};

export const toggleSetting = async (
  userId: string,
  settingKey:
    | "followerNotifications"
    | "replyNotifications"
    | "heartNotifications",
) => {
  const url = `/api/user/post/toggleSetting`;
  const response = await axios.post(url, {
    userId,
    settingKey,
  });
  return response;
};

export const changeBio = async (userId: string, bio: string) => {
  const url = `/api/user/post/changeBio`;
  const response = await axios.post(url, {
    userId,
    bio,
  });
  return response;
};
