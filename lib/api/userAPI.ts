import axios from "axios";
import { fetchSoundsbyType } from "@/lib/global/musicKit";
import { Favorite } from "@/types/dbTypes";

export const follow = async (followerId: string, followingId: string) => {
  await axios.post(`/api/user/follow`, { followerId, followingId });
};

export const unfollow = async (followerId: string, followingId: string) => {
  await axios.delete(
    `/api/user/unfollow?followerId=${followerId}&followingId=${followingId}`
  );
};

export const getUserById = async (userId: string, sessionUserId: string) => {
  const url = `/api/user/getById?id=${userId}&sessionUserId=${sessionUserId}`;
  const response = await axios.get(url);
  return response.data;
};

export const getUserDataAndAlbums = async (
  userId: string,
  sessionUserId: string
) => {
  const userData = await getUserById(userId, sessionUserId);
  const albumIds = userData.favorites.map((fav: Favorite) => fav.album.appleId);
  const albumsData = await fetchSoundsbyType("albums", albumIds);
  return { userData, albumsData };
};

export const fetchNotificationsForUser = async (userId: string) => {
  if (!userId) {
    throw new Error("user id is required");
  }
  const url = `/api/user/getNotifications?userId=${userId}`;
  const response = await axios.get(url);
  return response.data;
};

export const getSoundtrack = async (userId: string) => {
  const url = `/api/user/getSoundtrack?userId=${userId}`;
  const response = await axios.get(url);
  return response.data;
};
