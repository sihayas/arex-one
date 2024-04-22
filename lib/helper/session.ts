// Initial fetch of basic user and session data
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useUserAndSessionQuery = () => {
  return useQuery(
    ["userAndSession"],
    async () => {
      const response = await fetch("/api/oauth/me");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
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
