import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { attachSoundData } from "@/lib/helper/feed";

// Initial fetch of basic user and session data
export const useUserAndSessionQuery = () => {
  return useQuery(["userAndSession"], async () => {
    const response = await fetch("/api/oauth/me");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  });
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
        ? await followUser(sessionUserId, pageUserId) // Ensure these functions are adapted for `fetch`
        : await unfollowUser(sessionUserId, pageUserId); // Ensure these functions are adapted for `fetch`
    setFollowState((prevState) => ({ ...prevState, ...newState }));
  };

  const { data, isLoading, isError } = useQuery(
    ["userData", pageUserId],
    async () => {
      if (!sessionUserId || !pageUserId) return null;
      const response = await fetch(
        `/api/user/get?sessionUserId=${encodeURIComponent(
          sessionUserId,
        )}&pageUserId=${encodeURIComponent(pageUserId)}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
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

export const useEntriesQuery = (userId: string) => {
  return useInfiniteQuery(
    ["entries", userId],
    async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        userId,
        page: pageParam.toString(),
        limit: "8",
      });
      const url = `/api/user/get/entries?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();
      const { activities, pagination } = jsonResponse.data;

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

export const followUser = async (followerId: string, followingId: string) => {
  const response = await fetch(`/api/user/post/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ followerId, followingId }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return { followingAtoB: true };
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const response = await fetch(`/api/user/post/unfollow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      unfollowerId: followerId,
      unfollowingId: followingId,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return { followingAtoB: false };
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

export const useNotificationsQuery = (userId: string | undefined) => {
  return useQuery(
    ["notifications", userId],
    async () => {
      const response = await fetch(
        `/api/user/get/notifications?userId=${userId}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

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
