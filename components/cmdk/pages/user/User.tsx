import { useQuery } from "@tanstack/react-query";
import { useCMDK } from "@/context/CMDKContext";
import Favorites from "./subcomponents/Favorites";
import Image from "next/image";
import { useState } from "react";
import { ReviewData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";
import { UserEntry } from "./subcomponents/UserEntry";
import { UserAvatar } from "../../generics";
import { animated } from "@react-spring/web";
import { useDragLogic } from "@/hooks/npm/useDragUserLogic";

const User = () => {
  const { pages } = useCMDK();
  const { data: session } = useSession();
  const signedInUserId = session?.user.id;

  const userId = pages[pages.length - 1].user;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  // Use the drag logic hook
  const { bind, x } = useDragLogic();

  const { data: followStatus, refetch: refetchFollowStatus } = useQuery(
    ["followStatus", signedInUserId, userId],
    () =>
      signedInUserId && userId ? isUserFollowing(signedInUserId, userId) : null,
    {
      enabled: !!userId && !!signedInUserId,
      onSuccess: (data) => {
        if (data !== null) {
          setFollowingAtoB(data.isFollowingAtoB);
          setFollowingBtoA(data.isFollowingBtoA);
        }
      },
    }
  );

  // Function to handle follow/unfollow
  const handleFollow = async () => {
    if (!signedInUserId || !userId) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }

    setLoadingFollow(true);
    try {
      if (followingAtoB) {
        await unfollow(signedInUserId, userId);
        setFollowingAtoB(false);
      } else {
        await follow(signedInUserId, userId);
        setFollowingAtoB(true);
      }
      refetchFollowStatus();
    } catch (error) {
      console.error("Error following/unfollowing", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  // Query to get user Data
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["user", userId],
    () => {
      if (!userId || !session?.user.id) {
        throw new Error("userId must be defined");
      }
      return getUserById(userId, session.user.id);
    },
    {
      enabled: !!userId,
    }
  );

  let linkText = "link?";
  let linkColor = "#999";
  if (followingAtoB && followingBtoA) {
    linkText = "interlinked";
    linkColor = "#b1f36b";
  } else if (followingAtoB) {
    linkText = "linked";
    linkColor = "#000";
  } else if (followingBtoA) {
    linkText = "interlink?";
    linkColor = "#FFE601";
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  console.log(user);

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      <div className="absolute right-6 top-6 font-semibold text-[#000]">rx</div>
      {/* Header */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val * 0.94}px)`),
        }}
        className=" absolute top-[72px] -right-16 flex gap-4"
      >
        <div className="text-sm">favorites</div>
        <div className="text-sm text-gray3">soundtrack</div>
      </animated.div>

      {/* Container */}
      <div className="overflow-x-hidden w-full h-full">
        <animated.div
          className="flex w-[200%] h-full"
          {...bind()}
          style={{
            transform: x.to((val) => `translateX(${val}px)`),
          }}
        >
          <div className="flex w-full h-full ">
            <Favorites
              favorites={user.favorites}
              reviews={user._count.reviews}
              sounds={user.uniqueAlbumCount}
            />
          </div>
          <div className="flex flex-col mt-[80px] pb-32 p-6 gap-4 w-full">
            {user.reviews.map((review: ReviewData, i: string) => (
              <UserEntry key={i} review={review} />
            ))}
          </div>
        </animated.div>
      </div>

      {/* Footer  */}
      <div className="flex fixed items-center justify-between p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full">
        <div className="flex gap-2 items-center">
          <Image
            className="border-[1.5px] border-silver rounded-full"
            src={user.image}
            alt={`${user.name}'s avatar`}
            width={48}
            height={48}
          />
          <div className="text-xs font-medium text-[#000]">{user.name}*</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Following Status/Button */}
          {signedInUserId && userId && (
            <div className="flex gap-1 items-center justify-center hoverable-small">
              <div
                className="w-[6px] h-[6px] rounded-full"
                style={{ backgroundColor: linkColor }} // Set color based on following status
              />
              <button
                className={`text-xs font-medium font-mono hover:underline transition-all duration-300${
                  loadingFollow ? " pulse" : ""
                }`}
                style={{ color: linkColor }} // Set color based on following status
                onClick={handleFollow}
              >
                {linkText}
              </button>
            </div>
          )}

          {/* Followers Preview */}
          {user.followers.length > 0 ? (
            <div className="flex">
              {user.followers.length > 3 && (
                <div className="text-xs text-gray2">
                  +{user.followers.length - 3}
                </div>
              )}
              {user.followers.slice(0, 3).map(({ follower }, index) => {
                return (
                  <UserAvatar
                    key={index}
                    className={`!border-2 border-white shadow-md ${
                      index !== 0 ? "-ml-1" : ""
                    }`}
                    imageSrc={follower.image} // Access properties on the nested follower object
                    altText={`${follower.name}'s avatar`}
                    width={20}
                    height={20}
                  />
                );
              })}
            </div>
          ) : (
            <div>No followers</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
