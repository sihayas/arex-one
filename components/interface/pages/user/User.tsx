import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AsteriskIcon, StatsIcon } from "@/components/icons";

import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";

import Favorites from "./sub/Favorites";
import Stats from "./sub/Stats";
import UserAvatar from "@/components/global/UserAvatar";

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const signedInUserId = session?.user.id;
  const userId = pages[pages.length - 1].key;
  const isOwnProfile = session?.user.id === userId;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"stats" | "favorites">("favorites");
  const handleStatsClick = () => setActiveTab("stats");
  const handleFavoritesClick = () => setActiveTab("favorites");

  const { data: followStatus, refetch: refetchFollowStatus } = useQuery(
    ["followStatus", signedInUserId, userId],
    () =>
      signedInUserId && userId ? isUserFollowing(signedInUserId, userId) : null,
    {
      enabled: !!session,
    }
  );

  useEffect(() => {
    if (followStatus !== null) {
      setFollowingAtoB(followStatus.isFollowingAtoB);
      setFollowingBtoA(followStatus.isFollowingBtoA);
    }
  }, [followStatus]);


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
      await refetchFollowStatus();
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
      return getUserById(userId, session!.user.id);
    },
    {
      enabled: !!userId,
    }
  );

  let linkText = "LINK";
  let linkColor = "#999";
  if (followingAtoB && followingBtoA) {
    linkText = "INTERLINKED";
    linkColor = "#00FF00";
  } else if (followingAtoB) {
    linkText = "LINKED";
    linkColor = "#000";
  } else if (followingBtoA) {
    linkText = "INTERLINK";
    linkColor = "#FFEA00";
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
      <div className="flex flex-col items-end p-8 w-full h-full relative">
        {isLoading ? (
            <div>Loading...</div>
        ) : isError ? (
            <div>Error</div>
        ) : (
            <>
              <div className="text-sm text-black font-semibold leading-3">@{user.name}</div>
              <div className="text-xs text-gray3 uppercase leading-3 mt-[13px]">LAST PLAYED</div>
              <div className="flex items-center gap-6 mt-[33px]">
                <StatsIcon onClick={handleStatsClick} width={10} height={10} color={"#CCC"} />
                <AsteriskIcon onClick={handleFavoritesClick} width={10} height={10} color={"#000"} />
              </div>
              <div className="flex flex-col mt-[44px] gap-7">
                {activeTab === "favorites" ? (
                    <Favorites favorites={user.favorites} />
                ) : (
                    <Stats />
                )}
              </div>
              <div className="absolute left-2 top-2 flex items-center gap-2">
                <UserAvatar
                    className="shadow-md border border-none"
                    imageSrc={user.image}
                    altText={`${user.name}'s avatar`}
                    width={48}
                    height={48}
                    userId={user.id}
                />
                {renderFollowButton()}
              </div>
            </>
        )}
      </div>
  );

};

export default User;
