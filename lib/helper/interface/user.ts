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
    console.log("data", data);
    return data;
  });
};

// Get user profile data
export const useUserProfileQuery = (
  userId: string | undefined,
  pageUserId: string | undefined,
) => {
  return useQuery(["userData", pageUserId], async () => {
    if (!userId || !pageUserId) return null;
    const response = await fetch(
      `/api/user/get/profile?userId=${userId}&pageUserId=${pageUserId}`,
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  });
};

export const useEntriesQuery = (
  userId: string | undefined,
  pageUserId: string,
) => {
  // return useInfiniteQuery(
  //   ["entries", userId],
  //   async ({ pageParam = 1 }) => {
  //     if (!userId || !pageUserId) return null;
  //     const queryParams = new URLSearchParams({
  //       userId,
  //       pageUserId,
  //       page: pageParam.toString(),
  //     });
  //     const url = `/api/user/get/entries?${queryParams.toString()}`;
  //
  //     const response = await fetch(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //
  //     const jsonResponse = await response.json();
  //     const { activities, pagination } = jsonResponse.data;
  //
  //     const mergedData = await attachSoundData(activities);
  //
  //     return { data: mergedData, pagination };
  //   },
  //   {
  //     getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage || null,
  //     enabled: !!userId,
  //     refetchOnWindowFocus: false,
  //   },
  // );
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
  return useInfiniteQuery(
    ["notifications", userId],
    async ({ pageParam = 0 }) => {
      if (!userId) return null;
      const queryParams = new URLSearchParams({
        userId,
        cursor: pageParam,
      });
      const url = `/api/user/get/notifications?${queryParams.toString()}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const { notifications, nextCursor } = data.data;

      if (!notifications) {
        throw new Error("Unexpected server response structure");
      }

      return { data: notifications, nextPageParam: nextCursor }; // Supplying the next cursor for the next query
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextPageParam,
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
  // const response = await fetch(`/api/user/post/notificationSetting`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     userId,
  //     settingType,
  //     value,
  //   }),
  // });
  //
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.error || "Network response was not ok");
  // }
  //
  // // Optionally, return the updated settings if needed
  // const updatedSettings = await response.json();
  // return updatedSettings;
};
