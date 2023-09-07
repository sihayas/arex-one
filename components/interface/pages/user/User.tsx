import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useHandleSignalClick } from "@/hooks/useInteractions/useHandlePageChange";

import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";
import { animated } from "@react-spring/web";

import Favorites from "./sub/Favorites";

const favoritesMaxHeight = "592px";
const reviewsMaxHeight = "";

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const signedInUserId = session?.user.id;
  const userId = pages[pages.length - 1].key;
  const isOwnProfile = session?.user.id === userId;

  const handleSignalClick = useHandleSignalClick();

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const { data: followStatus, refetch: refetchFollowStatus } = useQuery(
    ["followStatus", signedInUserId, userId],
    () =>
      signedInUserId && userId ? isUserFollowing(signedInUserId, userId) : null,
    {
      enabled: !!session,
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
    linkText = "INTERLINKED";
    linkColor = "#00FF00";
  } else if (followingAtoB) {
    linkText = "LINKED";
    linkColor = "#000";
  } else if (followingBtoA) {
    linkText = "INTERLINK?";
    linkColor = "#FFEA00";
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  const renderFollowButton = () => (
    <div className="flex gap-1 items-center justify-center hoverable-small">
      <div
        className="w-[6px] h-[6px] rounded-full"
        style={{ backgroundColor: linkColor }}
      />
      <button
        className={`text-xs font-mono hover:underline transition-all duration-300${
          loadingFollow ? " pulse" : ""
        }`}
        style={{ color: linkColor }}
        onClick={handleFollow}
      >
        {linkText}
      </button>
    </div>
  );

  const renderFooter = () =>
    isOwnProfile ? (
      <div className="flex flex-col z-50 border-t border-silver border-dashed w-full mt-auto">
        <div className="flex gap-2 items-center pt-8">
          <Image
            className="border-[1.5px] border-silver rounded-full"
            src={user.image}
            alt={`${user.name}'s avatar`}
            width={48}
            height={48}
          />
          <div className="text-sm font-medium text-[#000]">{user.name}</div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full rounded-b-[20px]">
        <div className="flex gap-2 items-center">
          <Image
            className="border-[1.5px] border-silver rounded-full"
            src={user.image}
            alt={`${user.name}'s avatar`}
            width={48}
            height={48}
          />
          <div className="text-xs font-medium text-[#000]">{user.name}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {renderFollowButton()}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-[480px] h-[600px] overflow-scroll p-8">
      {/* Container */}
      {/* <Favorites
          favorites={user.favorites}
          reviews={user._count.reviews}
          sounds={user.uniqueAlbumCount}
          bio={user.bio}
        /> */}

      {renderFooter()}
    </div>
  );
};

export default User;
