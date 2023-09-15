import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";

import { follow, unfollow, getUserById } from "@/lib/api/userAPI";

import Favorites from "./sub/Favorites";
import UserAvatar from "@/components/global/UserAvatar";
import Soundtrack from "@/components/interface/pages/user/sub/Soundtrack";

const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const sessionUserId = session?.user.id;
  const userId = pages[pages.length - 1].key;
  const isOwnProfile = session?.user.id === userId;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );

  const handleSoundtrackClick = () => {
    setActiveTab("soundtrack");
  };

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!sessionUserId || !userId) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }
    setLoadingFollow(true);
    try {
      followingAtoB
        ? await unfollow(sessionUserId, userId)
        : await follow(sessionUserId, userId);
      setFollowingAtoB(!followingAtoB);
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
  } = useQuery(["user", userId], () => {
    return getUserById(userId, sessionUserId!);
  });

  useEffect(() => {
    if (user) {
      setFollowingAtoB(user.isFollowingAtoB);
      setFollowingBtoA(user.isFollowingBtoA);
    }
  }, [user]);

  const linkStatus =
    followingAtoB && followingBtoA
      ? "INTERLINKED"
      : followingAtoB
      ? "LINKED"
      : followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

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
        className={`text-xs hover:underline transition-all duration-300 ${
          loadingFollow ? "pulse" : ""
        }`}
        style={{ color: linkColor }}
        onClick={handleFollow}
      >
        {linkText}
      </button>
    </div>
  );

  console.log("user", user);
  return activeTab === "profile" ? (
    <div className="flex gap-2 h-full w-full relative">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          <UserAvatar
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-silver z-10"
            imageSrc={user.image}
            altText={`${user.name}'s avatar`}
            width={88}
            height={88}
            userId={user.id}
          />
          {/* Essentials */}
          <div className="flex flex-col ml-8 mt-[160px] h-full">
            <h1 className="text-gray3 text-xs leading-3 font-medium">
              ESSENTIALS
            </h1>
            <div className="flex flex-col gap-8 mt-5">
              <Favorites favorites={user.favorites} />
            </div>
            {/* Follow Button */}
            {!isOwnProfile && renderFollowButton()}
          </div>

          {/* Stats */}
          <div className="flex flex-col ml-auto gap-8 pt-8 pr-8">
            {/* Joined */}
            <div className="flex flex-col items-end w-full gap-[6px]">
              <div className="text-gray3 text-xs leading-3 font-medium">
                EVERSINCE
              </div>
              <div className="text-black text-sm leading-3">August</div>
            </div>
            {/* Sounds */}
            <div className="flex flex-col items-end w-full gap-[6px]">
              <div
                onClick={handleSoundtrackClick}
                className="text-gray3 text-xs font-medium cursor-pointer"
              >
                SOUNDS
              </div>
              <div className="text-black text-sm">
                {user.uniqueAlbums.length}
              </div>
            </div>
            {/* Links */}
            <div className="flex flex-col items-end w-full gap-[6px]">
              <div className="text-gray3 text-xs font-medium">LINKS</div>
              <div className="text-black text-sm">{user._count.followers}</div>
            </div>
          </div>
        </>
      )}
    </div>
  ) : (
    activeTab === "soundtrack" && <Soundtrack sounds={user.uniqueAlbums} />
  );
};

export default User;
