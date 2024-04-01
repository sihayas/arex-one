import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

// Get user profile data
export const useUserDataQuery = (
  userId: string | undefined,
  pageUserId: string | undefined,
) => {
  return useQuery(["userData", pageUserId], async () => {
    if (!userId || !pageUserId) return null;
    const response = await fetch(
      `/api/user/get?userId=${encodeURIComponent(
        userId,
      )}&pageUserId=${encodeURIComponent(pageUserId)}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data; // Directly return the fetched data
  });
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

export const useSettingsQuery = (userId: string | undefined) => {
  return useQuery(["userSettings", userId], async () => {
    if (!userId) return null;
    const response = await fetch(
      `/api/user/get/settings?userId=${encodeURIComponent(userId)}`,
    );
    if (!response.ok) {
      throw new Error("Fetching user settings failed");
    }
    const data = await response.json();
    return data;
  });
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

export const unfollowUser = async (userId: string, pageUserId: string) => {
  const response = await fetch(`/api/user/post/unfollow`, {
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

export const updateNotificationSetting = async (
  userId: string | undefined,
  settingType: string,
  value: boolean,
) => {
  const response = await fetch(`/api/user/post/notificationSetting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      settingType,
      value,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Network response was not ok");
  }

  // Optionally, return the updated settings if needed
  const updatedSettings = await response.json();
  return updatedSettings;
};
