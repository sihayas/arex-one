import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import { SettingsIcon } from "@/components/icons";
import FollowButton from "./sub/components/Link";
import { UserType } from "@/types/dbTypes";
import { createPortal } from "react-dom";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";

// Define link properties for different states
const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

// User component
const User = () => {
  const {
    user,
    pages,
    feedHistory,
    setFeedHistory,
    setActiveFeed,
    setIsVisible,
  } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;
  const isOwnProfile = user?.id === pageUser?.id;
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

  // Fetch user data and albums
  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);
  const { userData } = data || {};

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

  // const handleSetFeedUser = (user: UserType) => {
  //   // Remove the user if they are already in the feed user history
  //   const newHistory = feedHistory.filter((u) => u.id !== user.id);
  //
  //   // Add the user to the front of the feed user history
  //   newHistory.unshift(user);
  //
  //   // Update the feed user history
  //   setFeedHistory(newHistory);
  //
  //   // Set the active feed user
  //   setActiveFeed(user);
  //   setIsVisible(false);
  // };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex p-8"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Left Side */}
          <div className={`flex flex-col`}>
            {/* Sounds Count */}
            <div className={`flex flex-col gap-[12px]`}>
              <div className="text-xs text-gray3 leading-[9px]">SOUNDS</div>
              <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                {userData.soundCount}
              </div>
            </div>

            {/* Records Count */}
            <div className={`flex flex-col gap-[12px] mt-[23px]`}>
              <div className="text-xs text-gray3 leading-[9px]">RECORDS</div>
              <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                {userData._count.record}
              </div>
            </div>

            {/* Avatar and Link */}
            <div className={`flex gap-4 relative mt-auto`}>
              <Image
                className={`rounded-full border border-silver`}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={64}
                height={64}
              />

              {/* Name and Bio */}
              {/*<div className={`flex flex-col gap-[6px] mt-[18px] w-full`}>*/}
              {/*  <div className={`text-sm text-gray4 leading-[9px] font-medium`}>*/}
              {/*    {userData.username}*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className={`text-sm text-gray2 w-full max-h-[105px] line-clamp-5`}*/}
              {/*  >*/}
              {/*    {userData.bio}*/}
              {/*  </div>*/}
              {/*</div>*/}

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
            {/* Logo and Date */}
            {/*<div className={`flex items-center text-gray3 font-serif`}>*/}
            {/*  <div className="text-xs leading-[13px] text-black">RX</div>*/}
            {/*  <div className={`mx-1`}>&middot;</div>*/}
            {/*  <div className="text-xs text-gray2 leading-[9px]">MONTH 1</div>*/}
            {/*</div>*/}
            {/*  */}
          </div>

          {createPortal(<Essentials essentials={userData.essentials} />, cmdk)}

          {/* Right Side , Essentials & Settings*/}
        </>
      )}
    </motion.div>
  );
};

export default User;
