import axios from "axios";
import { fetchSoundsByTypes, fetchSoundsbyType } from "@/lib/global/musicKit";
import { Essential, Record } from "@/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlbumData, SongData } from "@/types/appleTypes";

// Get user data, handle follow/unfollow, and fetch favorites
export const useUserDataAndAlbumsQuery = (
  userId: string | undefined,
  sessionUserId: string | undefined
) => {
  // Follow state
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
    if (!sessionUserId || !userId) return;

    // Optimistically update the state
    setFollowState((prevState) => ({
      ...prevState,
      followingAtoB: action === "follow",
    }));

    try {
      const newState =
        action === "follow"
          ? await followUser(sessionUserId, userId)
          : await unfollowUser(sessionUserId, userId);

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
    ["userDataAndAlbums", userId],
    async () => {
      if (!userId || !sessionUserId) return null;
      // Axios request for user data
      const url = `/api/user/get/byId`;
      const response = await axios.get(url, {
        params: {
          id: userId,
          sessionUserId,
        },
      });
      const userData = response.data;
      const albumIds = userData.essentials.map(
        (essential: Essential) => essential.album.appleId
      );
      const albumsData = await fetchSoundsbyType("albums", albumIds);

      // Attach album data to each favorite
      userData.essentials.forEach((essential: Essential, index: number) => {
        essential.appleAlbumData = albumsData[index];
      });

      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: userData.isFollowingAtoB,
        followingBtoA: userData.isFollowingBtoA,
      }));

      return { userData, essentials: userData.essentials };
    }
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
      const url = `/api/user/get/settingsById`;
      const response = await axios.get(url, {
        params: {
          userId,
        },
      });
      return response.data;
    }
  );

  return { data, isLoading, isError };
};

// Soundtrack (sound history) handlers
export const useUserSoundtrackQuery = (userId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["mergedData", userId],
    async () => {
      // Axios request for soundtrack data
      const url = `/api/user/get/soundtrackById`;
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
          .map((album: AlbumData) => [album.id, album])
      );

      const trackLookup = Object.fromEntries(
        anyData
          .filter((item: AlbumData | SongData) => item.type === "songs")
          .map((track: SongData) => [track.id, track])
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
    }
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
export const fetchNotificationsForUser = async (userId: string) => {
  if (!userId) {
    throw new Error("user id is required");
  }
  const url = `/api/user/getNotifications`;
  const response = await axios.get(url, {
    params: {
      userId,
    },
  });
  return response.data;
};

// Edit essential handler
export const changeEssential = async (
  userId: string,
  prevEssentialId: string | null,
  appleId: string,
  rank: number
) => {
  const url = `/api/user/post/changeEssential`;
  const response = await axios.post(url, {
    userId,
    prevEssentialId,
    appleId,
    rank,
  });
  return response; // return the entire response object
};
