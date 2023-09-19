// Fetches users profile
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import ProfileEssentials from "./components/ProfileEssentials";
import { follow, unfollow } from "@/lib/api/userAPI";
import { UserData } from "@/lib/global/interfaces";
import { ArrowIcon } from "@/components/icons";

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

const UserProfile: React.FC<ProfileProps> = ({
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
    <div className="w-1/2 h-full flex flex-col">
      {/* Essentials */}
      <div className="flex flex-col mx-8">
        <h1 className="text-gray3 text-xs leading-none font-medium mt-[31px]">
          ESSENTIALS
        </h1>
        <ProfileEssentials favorites={userData.favorites} />
        {/* Follow Button */}
      </div>

      {/* Stats */}
      <div className="flex flex-col mx-8">
        {/* Sounds */}
        <div
          onClick={handleSoundtrackClick}
          style={{
            display: "grid",
            gridTemplateColumns: "64px 64px 32px",
            width: "100%",
            paddingTop: "138px",
            cursor: "pointer",
          }}
        >
          <div className="text-gray3 text-xs leading-none font-medium">
            SOUNDS
          </div>
          <div className="text-black text-xs leading-none ml-[29px]">
            {userData.uniqueAlbums.length}
          </div>
          <ArrowIcon className="mt-[1px]" />
        </div>
        {/* Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "64px 64px 32px",
            width: "100%",
            paddingTop: "20px",
          }}
        >
          <div className="text-gray3 text-xs leading-none font-medium">
            LINKS
          </div>
          <div className="text-black text-xs leading-none ml-[29px]">
            {userData._count.followers}
          </div>
          <ArrowIcon className="mt-[1px]" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

// {!isOwnProfile && (
//     <div className="flex items-center justify-center absolute left-[50px] top-6">
//       <div
//           className="rounded-full w-[9px] h-[9px]"
//           style={{ backgroundColor: linkColor }}
//       />
//       {/* Horizontal Line */}
//       <div
//           className="w-[24px] h-[1px]"
//           style={{ backgroundColor: linkColor }}
//       />
//
//       <button
//           className={`text-xs hover:underline transition-all duration-300 ${
//               loadingFollow ? "pulse" : ""
//           }`}
//           style={{ color: linkColor }}
//           onClick={handleFollow}
//       >
//         {linkText}
//       </button>
//     </div>
// )}
