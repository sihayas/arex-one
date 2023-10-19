import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { follow, getUserDataAndAlbums, unfollow } from "@/lib/api/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import { format } from "date-fns";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";

const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

type FollowState = {
  followingAtoB: boolean | null;
  followingBtoA: boolean | null;
  loadingFollow: boolean;
};

const User = () => {
  const user = useUser();
  const { pages } = useInterfaceContext();

  // User IDs
  const authenticatedUserId = user?.id;
  const pageUser = pages[pages.length - 1].user;

  // Store following status
  const [followState, setFollowState] = useState<FollowState>({
    followingAtoB: null,
    followingBtoA: null,
    loadingFollow: false,
  });

  const linkStatus =
    followState.followingAtoB && followState.followingBtoA
      ? "INTERLINKED"
      : followState.followingAtoB
      ? "LINKED"
      : followState.followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile"
  );

  // Get comprehensive user data
  const { data, isLoading, isError } = useQuery(
    ["userDataAndAlbums", pageUser ? pageUser.id : undefined],
    () =>
      pageUser ? getUserDataAndAlbums(pageUser.id, authenticatedUserId!) : null
  );

  const { userData, albumsData } = data || {};

  useEffect(() => {
    if (userData) {
      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: userData.isFollowingAtoB,
        followingBtoA: userData.isFollowingBtoA,
      }));
    }
  }, [userData]);

  const handleSoundtrackClick = () => {
    setActiveTab("soundtrack");
  };

  const handleImageClick = () => {
    setActiveTab("profile");
  };

  const handleFollow = async () => {
    if (!authenticatedUserId || !pageUser) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }
    setFollowState((prevState) => ({ ...prevState, loadingFollow: true }));
    try {
      followState.followingAtoB
        ? await unfollow(authenticatedUserId, pageUser.id)
        : await follow(authenticatedUserId, pageUser.id);
      setFollowState((prevState) => ({
        ...prevState,
        followingAtoB: !prevState.followingAtoB,
      }));
    } catch (error) {
      console.error("Error following/unfollowing", error);
    } finally {
      setFollowState((prevState) => ({ ...prevState, loadingFollow: false }));
    }
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {isLoading ? (
        <JellyComponent
          className={
            "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
          }
          key="jelly"
          isVisible={true}
        />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Content Outer */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: activeTab === "soundtrack" ? "-576px" : "0px" }}
            transition={{ type: "spring", stiffness: 880, damping: 80 }}
            className="w-[200%] h-full flex"
          >
            <div className="w-1/2 h-full flex justify-between">
              <Essentials favorites={albumsData} />
              <div className="flex flex-col items-end gap-7 p-8">
                <Image
                  className={`rounded-full outline outline-silver outline-2 -mt-4 -mr-4`}
                  onClick={handleImageClick}
                  src={userData.image}
                  alt={`${userData.name}'s avatar`}
                  width={64}
                  height={64}
                />
                {/* Since */}
                <div className="flex flex-col gap-[10px] text-end mt-[48px]">
                  <div className="text-xs text-gray3 leading-none font-medium tracking-widest">
                    EVER SINCE
                  </div>
                  <div className="text-black text-sm leading-none">
                    {format(new Date(userData.dateJoined), "MM.dd.yy")}
                  </div>
                </div>
                {/* Sounds */}
                <div className="flex flex-col gap-[10px] text-end">
                  <div
                    onClick={handleSoundtrackClick}
                    className="text-xs text-gray3 leading-none font-medium tracking-widest cursor-pointer"
                  >
                    UNIQUE SOUNDS
                  </div>
                  <div className="text-black text-sm leading-none">
                    {userData.uniqueAlbums.length}
                  </div>
                </div>
                {/* Following / Followers */}
                <div className="flex flex-col gap-[10px] text-end">
                  <div className="text-xs text-gray3 leading-none font-medium tracking-widest">
                    LINKS
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <div className="text-black font-medium text-sm leading-none">
                      {userData._count.followers}
                    </div>

                    <div className="w-2 h-2 bg-[#FFEA00] rounded-full ml-2" />
                    <div className="text-[#FFEA00] font-medium text-sm leading-none">
                      {userData._count.followers}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === "soundtrack" && pageUser ? (
              <Soundtrack userId={pageUser.id} />
            ) : null}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default User;
