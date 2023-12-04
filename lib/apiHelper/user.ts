import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, ActivityType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";
import { attachSoundData } from "@/lib/apiHelper/feed";

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

// Get user settings
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

// Soundtrack (sound history) handlers
export const useSoundtrackQuery = (userId: string | undefined) => {
  return useQuery(
    ["soundtrack", userId],
    async () => {
      const url = `/api/user/get/soundtrack`;
      const response = await axios.get(url, {
        params: {
          userId,
        },
      });

      const activities = response.data;

      return await attachSoundData(activities);
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
      retry: false,
    },
  );
};

// Following handlers
export const followUser = async (followerId: string, followingId: string) => {
  await axios.post(`/api/user/post/follow`, { followerId, followingId });
  return { followingAtoB: true };
};

// Unfollowing handlers
export const unfollowUser = async (followerId: string, followingId: string) => {
  await axios.delete(`/api/user/post/unfollow`, {
    params: {
      unfollowerId: followerId,
      unfollowingId: followingId,
    },
  });
  return { followingAtoB: false };
};

// Notifications handlers
// export const useNotificationsQuery = (userId: string | undefined) => {
//   const {
//     data: notifications,
//     isLoading,
//     isError,
//   } = useQuery(
//     ["notifications", userId],
//     async () => {
//       const url = `/apiHelper/user/get/notifications`;
//       const response = await axios.get(url, {
//         params: {
//           userId,
//         },
//       });
//
//       // If notifications exist, attach sound data to each notification
//       if (response.data) {
//         // Initialize appleIds and fetchedMapping
//         let appleIds: { songs: string[]; albums: string[] } = {
//           songs: [],
//           albums: [],
//         };
//         const fetchedMapping: { [key: string]: AlbumData | SongData } = {};
//
//         // Loop through notifications to populate appleIds
//         response.data.forEach((notif: extendedNotification) => {
//           if (notif.soundAppleId) {
//             const { id, type } = notif.soundAppleId;
//             appleIds[type === "song" ? "songs" : "albums"].push(id);
//           }
//         });
//
//         // Fetch sounds by types and enhance notifications with fetched data
//         const fetchedSounds = await fetchSoundsByTypes(appleIds);
//         // Populate fetchedMapping with fetched data
//         fetchedSounds.forEach(
//           (item: AlbumData | SongData) => (fetchedMapping[item.id] = item),
//         );
//
//         // Merge notifications with fetched data
//         const mergedNotifications = response.data.map(
//           (notif: extendedNotification) => {
//             if (notif.soundAppleId) {
//               const { id } = notif.soundAppleId;
//               // If id exists, add fetched data to notification
//               if (id) {
//                 notif.fetchedSound = fetchedMapping[id];
//               }
//             }
//             return notif;
//           },
//         );
//
//         // Return the enhanced notifications
//         return mergedNotifications;
//       }
//
//       return response.data;
//     },
//     {
//       enabled: !!userId,
//     },
//   );
//
//   return { data: notifications, isLoading, isError };
// };

// Edit essential handler
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

// Toggle settings handler
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

// Change bio handler
export const changeBio = async (userId: string, bio: string) => {
  const url = `/api/user/post/changeBio`;
  const response = await axios.post(url, {
    userId,
    bio,
  });
  return response;
};
