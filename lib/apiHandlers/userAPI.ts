import axios from "axios";
import { fetchSoundsByTypes } from "@/lib/global/musicKit";
import { Record } from "@/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlbumData, SongData } from "@/types/appleTypes";
import { extendedNotification } from "@/components/interface/nav/sub/Signals";

// Get user data, handle follow/unfollow, and fetch favorites
export const useUserDataAndAlbumsQuery = (
  sessionUserId: string | undefined,
  pageUserId: string | undefined,
) => {
  const [followState, setFollowState] = useState<{
    followingAtoB: boolean | null;
    followingBtoA: boolean | null;
    loadingFollow: boolean;
  }>({
    followingAtoB: null,
    followingBtoA: null,
    loadingFollow: false,
  });

  const handleFollowUnfollow = async (action: "follow" | "unfollow") => {
    if (!sessionUserId || !pageUserId) return;

    // Optimistically update the state
    setFollowState((prevState) => ({
      ...prevState,
      followingAtoB: action === "follow",
    }));

    // Follow/unfollow user
    try {
      const newState =
        action === "follow"
          ? await followUser(sessionUserId, pageUserId)
          : await unfollowUser(sessionUserId, pageUserId);

      // Update the state with the actual result
      setFollowState((prevState) => ({
        ...prevState,
        ...newState,
      }));
    } catch (error) {
      // Revert the state in case of error
      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: action === "unfollow",
      }));
    }
  };

  // Fetch user data and albums
  const { data, isLoading, isError } = useQuery(
    ["userData", pageUserId],
    async () => {
      if (!sessionUserId || !pageUserId) return null;
      const url = `/api/user/get/byId`;
      const response = await axios.get(url, {
        params: {
          sessionUserId,
          pageUserId,
        },
      });
      const userData = response.data;

      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: userData.isFollowingAtoB,
        followingBtoA: userData.isFollowingBtoA,
      }));

      return { userData };
    },
  );

  return {
    data,
    isLoading,
    isError,
    followState,
    handleFollowUnfollow,
  };
};

// Get user settings
export const useUserSettingsQuery = (userId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["userSettings", userId],
    async () => {
      const url = `/api/user/get/settings`;
      const response = await axios.get(url, {
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
export const useUserSoundtrackQuery = (userId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["mergedData", userId],
    async () => {
      const url = `/api/user/get/soundtrack`;
      const response = await axios.get(url, {
        params: {
          userId,
        },
      });

      const soundtrackData = response.data;

      // Extract albumIds and trackIds
      const albumIds = soundtrackData
        .filter((record: Record): boolean => Boolean(record.album))
        .map((record: Record): string => record.album!.appleId);

      const trackIds = soundtrackData
        .filter((record: Record): boolean => Boolean(record.track))
        .map((record: Record): string => record.track!.appleId);

      // Fetch albums and tracks by ids
      const idTypes = { albums: albumIds, songs: trackIds };
      const anyData = await fetchSoundsByTypes(idTypes);

      // Create lookup tables for quick access
      const albumLookup = Object.fromEntries(
        anyData
          .filter((item: AlbumData | SongData) => item.type === "albums")
          .map((album: AlbumData) => [album.id, album]),
      );

      const trackLookup = Object.fromEntries(
        anyData
          .filter((item: AlbumData | SongData) => item.type === "songs")
          .map((track: SongData) => [track.id, track]),
      );

      // Merge soundtrackData, albumData, and trackData
      const finalMergedData = soundtrackData.map((item: Record) => {
        return {
          ...item,
          appleAlbumData: item.album ? albumLookup[item.album.appleId] : null,
          appleTrackData: item.track ? trackLookup[item.track.appleId] : null,
        };
      });
      return finalMergedData;
    },
  );

  return { data, isLoading, isError };
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
      followerId,
      followingId,
    },
  });
  return { followingAtoB: false };
};

// Notifications handlers
export const useNotificationsQuery = (userId: string | undefined) => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(
    ["notifications", userId],
    async () => {
      const url = `/api/user/get/notifications`;
      const response = await axios.get(url, {
        params: {
          userId,
        },
      });

      // If notifications exist, attach sound data to each notification
      if (response.data) {
        // Initialize appleIds and fetchedMapping
        let appleIds: { songs: string[]; albums: string[] } = {
          songs: [],
          albums: [],
        };
        const fetchedMapping: { [key: string]: AlbumData | SongData } = {};

        // Loop through notifications to populate appleIds
        response.data.forEach((notif: extendedNotification) => {
          if (notif.soundAppleId) {
            const { id, type } = notif.soundAppleId;
            appleIds[type === "song" ? "songs" : "albums"].push(id);
          }
        });

        // Fetch sounds by types and enhance notifications with fetched data
        const fetchedSounds = await fetchSoundsByTypes(appleIds);
        // Populate fetchedMapping with fetched data
        fetchedSounds.forEach(
          (item: AlbumData | SongData) => (fetchedMapping[item.id] = item),
        );

        // Merge notifications with fetched data
        const mergedNotifications = response.data.map(
          (notif: extendedNotification) => {
            if (notif.soundAppleId) {
              const { id } = notif.soundAppleId;
              // If id exists, add fetched data to notification
              if (id) {
                notif.fetchedSound = fetchedMapping[id];
              }
            }
            return notif;
          },
        );

        // Return the enhanced notifications
        return mergedNotifications;
      }

      return response.data;
    },
    {
      enabled: !!userId,
    },
  );

  return { data: notifications, isLoading, isError };
};

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
