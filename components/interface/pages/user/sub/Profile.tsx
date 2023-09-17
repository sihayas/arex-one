// Profile.tsx
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Favorites from "./Favorites";
import { follow, unfollow } from "@/lib/api/userAPI";
import { UserData } from "@/lib/global/interfaces";

type ProfileProps = {
  handleSoundtrackClick: () => void;
  userData: ExtendedUserData;
};

type ExtendedUserData = UserData & {
  isFollowingAtoB: boolean;
  isFollowingBtoA: boolean;
  uniqueAlbums: any;
  _count: {
    followers: number;
  };
  favorites: any;
};

const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

const Profile: React.FC<ProfileProps> = ({
  handleSoundtrackClick,
  userData,
}) => {
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;
  const userId = userData.id;
  const isOwnProfile = session?.user.id === userId;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

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

  useEffect(() => {
    if (userData) {
      setFollowingAtoB(userData.isFollowingAtoB);
      setFollowingBtoA(userData.isFollowingBtoA);
    }
  }, [userData]);

  const linkStatus =
    followingAtoB && followingBtoA
      ? "INTERLINKED"
      : followingAtoB
      ? "LINKED"
      : followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  return (
    <>
      {/* Essentials */}
      <div className="flex flex-col ml-8 pt-[180px] h-full">
        <h1 className="text-gray3 text-xs leading-3 font-medium">ESSENTIALS</h1>
        <div className="flex flex-col gap-8 mt-[6px]">
          <Favorites favorites={userData.favorites} />
        </div>
        {/* Follow Button */}
        {!isOwnProfile && (
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
        )}
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
            {userData.uniqueAlbums.length}
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-col items-end w-full gap-[6px]">
          <div className="text-gray3 text-xs font-medium">LINKS</div>
          <div className="text-black text-sm">{userData._count.followers}</div>
        </div>
      </div>
    </>
  );
};

export default Profile;
