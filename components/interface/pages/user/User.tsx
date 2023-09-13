import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

  const handleStatsClick = () => {
    console.log("Stats Clicked");
    setActiveTab("stats");
  };
  const handleFavoritesClick = () => {
    console.log("Favorites Clicked");
    setActiveTab("favorites");
  };


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
      return getUserById(userId, session!.user.id);
    },
    {
      enabled: !!userId,
    }
  );

  let linkText = "LINK";
  let linkColor = "#CCC";
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
    <div className="flex items-center justify-center absolute left-[50px] top-6">
      <div
        className="rounded-full w-[9px] h-[9px]"
        style={{ backgroundColor: linkColor }}
      />
      {/* Horizontal Line */}
        <div
            className="w-[24px] h-[1px]"
            style={{ backgroundColor: linkColor }}
        />

      <button
        className={`text-xs hover:underline transition-all duration-300${
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
      <div className="flex gap-2 h-full w-full relative">
        {isLoading ? (
            <div>Loading...</div>
        ) : isError ? (
            <div>Error</div>
        ) : (
            <>
              {/* Avatar / Follow*/}
              <div className="flex flex-col h-full">
                <UserAvatar
                    className="border shadow-md z-10 ml-2 mt-2"
                    imageSrc={user.image}
                    altText={`${user.name}'s avatar`}
                    width={48}
                    height={48}
                    userId={user.id}
                    style={{borderColor: linkColor}}
                />

                <div className="ml-8 mt-6 tracking-tighter text-xl font-semibold">{user.name}</div>


                {/*Essentials */}
                <div className="flex flex-col mt-[43px] ml-8 h-full">
                  <div className="flex gap-2">
                    <Favorites favorites={user.favorites} />
                  </div>
                  <div className="text-gray3 text-xs leading-3 mt-[13px]">ESSENTIALS</div>
                </div>

                {/* Follow Button */}
                {!isOwnProfile && renderFollowButton()}
              </div>



              {/* Stats */}
              <div className="flex flex-col ml-auto pr-8 pt-6 gap-8">
              {/*  Joined */}
                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs leading-3">RX SINCE</div>
                  <div className="text-black text-sm leading-3">August</div>
                </div>

                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs">SOUNDS</div>
                  <div className="text-black text-sm">{user._count.reviews}</div>
                </div>
                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs">LINKS</div>
                  <div className="text-black text-sm">{user._count.followers}</div>
                </div>
              </div>


            </>
        )}
      </div>
  );

};

export default User;
