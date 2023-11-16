import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { useUserDataAndAlbumsQuery } from "@/lib/apiHandlers/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import { SettingsIcon } from "@/components/icons";
import FollowButton from "./sub/components/LinkButton";
import { User } from "@/types/dbTypes";

// Define link properties for different states
const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

// User component
const User = () => {
  const user = useUser();
  const authenticatedUserId = user?.id;

  // Get page user
  const {
    pages,
    feedUserHistory,
    setFeedUserHistory,
    setActiveFeedUser,
    setIsVisible,
  } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;

  // Check if the profile belongs to the authenticated user
  const isOwnProfile = authenticatedUserId === pageUser?.id;

  // Fetch user data and albums
  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataAndAlbumsQuery(pageUser?.id, authenticatedUserId);
  const { userData, essentials } = data || {};

  // Determine link status based on follow state
  const linkStatus =
    followState?.followingAtoB && followState?.followingBtoA
      ? "INTERLINKED"
      : followState?.followingAtoB
      ? "LINKED"
      : followState?.followingBtoA
      ? "INTERLINK"
      : "LINK";

  // Get link text and color based on link status
  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  // State for settings
  const [subSection, setSubSection] = useState<"essentials" | "settings">(
    "essentials",
  );

  // Function to handle settings click
  const handleSubSectionClick = (section: "essentials" | "settings") =>
    setSubSection(section === subSection ? "essentials" : section);

  const handleSetFeedUser = (user: User) => {
    // Remove the user if they are already in the feed user history
    const newHistory = feedUserHistory.filter((u) => u.id !== user.id);

    // Add the user to the front of the feed user history
    newHistory.unshift(user);

    // Update the feed user history
    setFeedUserHistory(newHistory);

    // Set the active feed user
    setActiveFeedUser(user);
    setIsVisible(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col px-8 pb-8"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          <div className={`flex justify-between w-full h-full`}>
            {/* Left Side */}
            <div className={`flex flex-col py-8`}>
              {/* Logo and Date */}
              <div className={`flex items-center text-gray3`}>
                <div className="text-[19px] leading-[13px] text-black font-serif">
                  RX
                </div>
                <div className={`mx-1`}>&middot;</div>
                <div className="text-xs text-gray3 font-bold leading-[9px]">
                  MONTH 1
                </div>
              </div>

              {/*  Sounds Count */}
              <div className={`flex flex-col gap-[12px] mt-[42px]`}>
                <div className="text-xs text-gray3 leading-[9px]">SOUNDS</div>
                <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                  {userData.uniqueAlbums.length}
                </div>
              </div>

              {/*  Records Count */}
              <div className={`flex flex-col gap-[12px] mt-6`}>
                <div className="text-xs text-gray3 leading-[9px]">RECORDS</div>
                <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                  {userData._count.record}
                </div>
              </div>

              {/*  */}
            </div>

            {/* Right Side , Essentials & Settings*/}
            {isOwnProfile &&
            authenticatedUserId &&
            subSection !== "essentials" ? (
              // Show settings if subsection is not essentials and own profile
              <Settings
                userId={authenticatedUserId}
                essentials={essentials}
                bio={userData.bio}
              />
            ) : (
              // Show essentials by default or if subsection is "essentials"
              <Essentials essentials={essentials} />
            )}
          </div>

          {/* Avatar and Link */}
          <div className={`flex gap-4 relative`}>
            <Image
              className={`rounded-full border border-gray3`}
              src={userData.image}
              alt={`${userData.name}'s avatar`}
              width={80}
              height={80}
            />

            {/* Name and Bio */}
            <div className={`flex flex-col gap-[6px] mt-[18px] w-full`}>
              <div className={`text-sm font-semibold text-gray4 leading-[9px]`}>
                {userData.username}
              </div>
              <div
                className={`text-sm text-gray2 w-full max-h-[105px] line-clamp-5`}
              >
                {userData.bio}
              </div>
            </div>

            {isOwnProfile ? (
              <SettingsIcon
                onClick={() => handleSubSectionClick("settings")}
                className={`absolute left-0 bottom-0 bg-white rounded-full cursor-pointer`}
              />
            ) : (
              <FollowButton
                followState={followState}
                handleFollowUnfollow={handleFollowUnfollow}
                linkColor={linkColor}
                linkText={linkText}
              />
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default User;
