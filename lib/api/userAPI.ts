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

export const getUserById = async (userId: string) => {
  const url = `/api/user/getById?id=${userId}`;
  const response = await axios.get(url);
  return response.data;
};
