import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { follow, getUserById, unfollow } from "@/lib/api/userAPI";
import { UserData } from "@/lib/global/interfaces";
import Essentials from "@/components/interface/user/sub/components/Essentials";
import { ArrowIcon } from "@/components/icons";

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

const User = () => {
  const { data: session } = useSession();
  const { pages } = useInterfaceContext();

  const authenticatedUserId = session?.user.id;
  const pageUserId = pages[pages.length - 1].key;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const linkStatus =
    followingAtoB && followingBtoA
      ? "INTERLINKED"
      : followingAtoB
      ? "LINKED"
      : followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(["user", pageUserId], () => {
    return getUserById(pageUserId, authenticatedUserId!);
  });

  useEffect(() => {
    if (user) {
      setFollowingAtoB(user.isFollowingAtoB);
      setFollowingBtoA(user.isFollowingBtoA);
    }
  }, [user]);

  const handleSoundtrackClick = () => {
    setActiveTab("soundtrack");
  };

  const handleImageClick = () => {
    setActiveTab("profile");
  };

  const handleFollow = async () => {
    if (!authenticatedUserId || !pageUserId) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }
    setLoadingFollow(true);
    try {
      followingAtoB
        ? await unfollow(authenticatedUserId, pageUserId)
        : await follow(authenticatedUserId, pageUserId);
      setFollowingAtoB(!followingAtoB);
    } catch (error) {
      console.error("Error following/unfollowing", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col hiii">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Content Outer */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: activeTab === "soundtrack" ? "-384px" : "0px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="w-[200%] h-full flex"
          >
            <div className="w-1/2 h-full flex flex-col">
              {/* Essentials */}
              <div className="flex flex-col mx-8">
                <h1 className="text-gray2 text-xs leading-none font-medium mt-[31px]">
                  ESSENTIALS
                </h1>
                <Essentials favorites={user.favorites} />
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
                  <div className="text-gray2 text-xs leading-none font-medium">
                    SOUNDS
                  </div>
                  <div className="text-black text-xs leading-none ml-[29px]">
                    {user.uniqueAlbums.length}
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
                  <div className="text-gray2 text-xs leading-none font-medium">
                    LINKS
                  </div>
                  <div className="text-black text-xs leading-none ml-[29px]">
                    {user._count.followers}
                  </div>
                  <ArrowIcon className="mt-[1px]" />
                </div>
              </div>
            </div>
            {activeTab === "soundtrack" ? (
              <Soundtrack userId={pageUserId} />
            ) : null}
          </motion.div>

          {/* Footer / Avatar */}
          <div
            className={`absolute bottom-0 w-full flex justify-between p-4 ${
              activeTab === "profile"
                ? "border-t border-dashed" + " border-silver"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                className={`rounded-full border border-silver`}
                onClick={handleImageClick}
                src={user.image}
                alt={`${user.name}'s avatar`}
                width={42}
                height={42}
              />
              {activeTab !== "soundtrack" ? (
                <>
                  <div className="text-sm text-black font-medium">
                    @{user.name}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
