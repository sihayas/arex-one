import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useCMDK } from "@/context/CMDKContext";
import { useDragUserLogic } from "@/hooks/handleInteractions/useDragUserLogic";
import { useHandleSignalClick } from "@/hooks/handlePageChange/useHandleSignalClick";

import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";
import { animated } from "@react-spring/web";
import Favorites from "./subcomponents/Favorites";
import Soundtrack from "./subcomponents/Soundtrack";

const favoritesMaxHeight = "592px";
const reviewsMaxHeight = "";

const User = () => {
  const { pages } = useCMDK();
  const { data: session } = useSession();

  const signedInUserId = session?.user.id;
  const userId = pages[pages.length - 1].user;
  const isOwnProfile = session?.user.id === userId;

  const handleSignalClick = useHandleSignalClick();

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  // Use the drag logic hook
  const { bind, x, activeSection } = useDragUserLogic();

  const coraColor = activeSection === 0 ? "#000" : "#999";
  const soundtrackColor = activeSection === 1 ? "#000" : "#999";

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

  const renderHeader = () => (
    <animated.div
      {...bind()}
      style={{
        transform: x.to((val) => `translateX(${val * 0.94}px)`),
      }}
      className=" absolute top-[72px] -right-16 flex gap-4"
    >
      <div className="text-sm font-medium" style={{ color: coraColor }}>
        @cora
      </div>
      <div className="text-sm text-gray3" style={{ color: soundtrackColor }}>
        soundtrack
      </div>
    </animated.div>
  );

  const renderFooter = () =>
    isOwnProfile ? (
      <div className="flex flex-col fixed p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full rounded-b-[20px]">
        {/* Footer */}
        <div className="flex items-center justify-between">
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
          <div
            onClick={handleSignalClick}
            className="flex items-center gap-2 font-mono text-xs hoverable-small"
          >
            <span className="w-[12px] h-[12px] rounded-full bg-[#FFC700]" />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex fixed items-center justify-between p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full rounded-b-[20px]">
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
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      <div className="absolute right-6 top-6 font-semibold text-[#000]">rx</div>
      {renderHeader()}

      {/* Container */}
      <animated.div
        className="flex w-[200%] h-full"
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
          maxHeight:
            activeSection === 0 ? favoritesMaxHeight : reviewsMaxHeight,
        }}
      >
        <Favorites
          favorites={user.favorites}
          reviews={user._count.reviews}
          sounds={user.uniqueAlbumCount}
          bio={user.bio}
        />
        <Soundtrack reviews={user.reviews} />
      </animated.div>

      {renderFooter()}
    </div>
  );
};

export default User;
