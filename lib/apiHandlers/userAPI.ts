import axios from "axios";
import { fetchSoundsByTypes, fetchSoundsbyType } from "@/lib/global/musicKit";
import { Favorite, Record } from "@/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlbumData, SongData } from "@/types/appleTypes";

// User data handlers
export const getUserById = async (userId: string, sessionUserId: string) => {
  const url = `/api/user/getById`;
  const response = await axios.get(url, {
    params: {
      id: userId,
      sessionUserId,
    },
  });
  return response.data;
};

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

  const handleFollow = async () => {
    if (!sessionUserId || !userId) return;
    const newState = await followUser(sessionUserId, userId);
    setFollowState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const handleUnfollow = async () => {
    if (!sessionUserId || !userId) return;
    const newState = await unfollowUser(sessionUserId, userId);
    setFollowState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  // Fetch user data and albums
  const { data, isLoading, isError } = useQuery(
    ["userDataAndAlbums", userId],
    async () => {
      if (!userId || !sessionUserId) return null;
      const userData = await getUserById(userId, sessionUserId);
      const albumIds = userData.favorites.map(
        (fav: Favorite) => fav.album.appleId
      );
      const albumsData = await fetchSoundsbyType("albums", albumIds);

      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: userData.isFollowingAtoB,
        followingBtoA: userData.isFollowingBtoA,
      }));

      return { userData, albumsData };
    }
  );

  return {
    data,
    isLoading,
    isError,
    followState,
    handleFollow,
    handleUnfollow,
  };
};

// Soundtrack (sound history) handlers
export const useUserSoundtrackQuery = (userId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["mergedData", userId],
    async () => {
      // Fetch soundtrack data
      const url = `/api/user/getSoundtrack`;
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

// Following handlers
export const followUser = async (followerId: string, followingId: string) => {
  await axios.post(`/api/user/follow`, { followerId, followingId });
  return { followingAtoB: true };
};

// Unfollowing handlers
export const unfollowUser = async (followerId: string, followingId: string) => {
  await axios.delete(`/api/user/unfollow`, {
    params: {
      followerId,
      followingId,
    },
  });
  return { followingAtoB: false };
};
