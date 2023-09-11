import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useHandleSignalClick } from "@/hooks/useInteractions/useHandlePageChange";
import { AsteriskIcon, StatsIcon } from "@/components/icons";

import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";
import { animated } from "@react-spring/web";

import Favorites from "./sub/Favorites";
import { AlbumData } from "@/lib/global/interfaces";

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const signedInUserId = session?.user.id;
  const userId = pages[pages.length - 1].key;
  const isOwnProfile = session?.user.id === userId;

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
    <div className="flex gap-1 items-center justify-center ">
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

  return (
    <div className="flex flex-col p-8 w-full">
      <div className="text-sm text-gray2 uppercase font-medium">YEAR 1</div>
      <div className="text-sm text-gray3 uppercase mt-[13px]">LAST PLAYED</div>

      <div className="flex items-center gap-6 mt-8">
        <AsteriskIcon width={10} height={10} color={"#000"} />
        <StatsIcon width={10} height={10} color={"#CCC"} />
      </div>

      <div className="flex flex-col mt-[52px]">
        <Favorites favorites={user.favorites} bio={user.bio} />
      </div>
    </div>
  );
};

export default User;
