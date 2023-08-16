import axios from "axios";

export const isUserFollowing = async (
  signedInUserId: string,
  userId: string
) => {
  if (!signedInUserId || !userId) {
    throw new Error("Both signedInUserId and userId must be provided.");
  }
  const url = `/api/user/isFollowing?signedInUserId=${signedInUserId}&userId=${userId}`;
  const response = await axios.get(url);
  return response.data;
};

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

export const fetchNotificationsForUser = async (userId: string) => {
  if (!userId) {
    throw new Error("user id is required");
  }
  const url = `/api/user/getNotifications?userId=${userId}`;
  const response = await axios.get(url);
  return response.data;
};
