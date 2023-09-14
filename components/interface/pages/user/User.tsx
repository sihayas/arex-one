import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";


import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import ParticlesComponent from "@/components/interface/pages/user/sub/ParticlesComponent";


import {
  follow,
  unfollow,
  getUserById,
} from "@/lib/api/userAPI";

import Favorites from "./sub/Favorites";
import UserAvatar from "@/components/global/UserAvatar";


const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const sessionUserId = session?.user.id;
  const userId = pages[pages.length - 1].key;
  const isOwnProfile = session?.user.id === userId;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!sessionUserId || !userId) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }

    setLoadingFollow(true);
    try {
      if (followingAtoB) {
        await unfollow(sessionUserId, userId);
        setFollowingAtoB(false);
      } else {
        await follow(sessionUserId, userId);
        setFollowingAtoB(true);
      }
    } catch (error) {
      console.error("Error following/unfollowing", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  // Get user data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(
    ["user", userId],
    () => {
      return getUserById(userId, sessionUserId!);
    }
  );

  useEffect(() => {
    if (user) {
      setFollowingAtoB(user.isFollowingAtoB);
      setFollowingBtoA(user.isFollowingBtoA);
    }
  }, [user]);

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
              {/* Avatar / Favorites*/}
              <div className="flex flex-col h-full">
                <UserAvatar
                    className="border border-silver z-10 ml-2 mt-2"
                    imageSrc={user.image}
                    altText={`${user.name}'s avatar`}
                    width={88}
                    height={88}
                    userId={user.id}
                    // style={{borderColor: linkColor}}
                />

                {/*Essentials */}
                <div className="flex flex-col ml-8 mt-16 h-full">
                  <div className="text-gray3 text-xs leading-3 font-medium">ESSENTIALS</div>
                  <div className="flex flex-col gap-8 mt-5">
                    <Favorites favorites={user.favorites} />
                  </div>
                </div>


                {/* Follow Button */}
                {!isOwnProfile && renderFollowButton()}
              </div>

              {/* Stats */}
              <div className="flex flex-col ml-auto gap-8 pt-8 pr-8">
                {/*  Joined */}
                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs leading-3 font-medium">RX SINCE</div>
                  <div className="text-black text-sm leading-3">August</div>
                </div>

                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs font-medium">SOUNDS</div>
                  <div className="text-black text-sm">{user._count.reviews}</div>
                </div>
                <div className="flex flex-col items-end w-full gap-[6px]">
                  <div className="text-gray3 text-xs font-medium">LINKS</div>
                  <div className="text-black text-sm">{user._count.followers}</div>
                </div>
              </div>
              {/*<div className="absolute bottom-8 left-8 tracking-tighter text-xl font-semibold text-black">@{user.name}</div>*/}
            </>
        )}
      </div>
  );

};

export default User;
