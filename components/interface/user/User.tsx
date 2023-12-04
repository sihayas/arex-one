import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Recents from "@/components/interface/user/sub/Recents";
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
import Soundtrack from "@/components/interface/user/sub/Soundtrack";

// Define link properties for different states
const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

// Personal component
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

  // Fetch user data and albums
  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);
  const { userData } = data || {};

  // State for settings
  const [subSection, setSubSection] = useState<
    "essentials" | "settings" | "soundtrack"
  >("essentials");

  // Function to handle settings click
  const handleSubSectionClick =
    (section: "essentials" | "settings" | "soundtrack") => () => {
      setSubSection(section === subSection ? "essentials" : section);
    };

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
      className="w-full h-full flex flex-col relative"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Avatar, Name, Bio, Stats */}
          <div
            className={`absolute top-0 flex justify-between gap-8 p-8 w-full`}
          >
            <div className={`flex flex-col w-full mt-8`}>
              {/*<div*/}
              {/*  className={`text-[24px] text-black leading-[17px] font-semibold`}*/}
              {/*>*/}
              {/*  {userData.username}*/}
              {/*</div>*/}
              {/*<div*/}
              {/*  className={`text-sm text-gray2 w-full max-h-[288px] line-clamp-5 mt-[9px]`}*/}
              {/*>*/}
              {/*  {userData.bio}*/}
              {/*</div>*/}
            </div>

            <div className={`min-w-[96px] flex`}>
              <Image
                className={`rounded-full border border-silver min-w-[96px] shadow-userAvi`}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={96}
                height={96}
              />
            </div>

            <button
              className={`absolute left-0`}
              onClick={handleSubSectionClick("soundtrack")}
            >
              soundtrack
            </button>
          </div>
          {subSection === "essentials" && (
            <>
              <div className="text-xs text-gray3 leading-[9px] uppercase ml-8 mt-[224px]">
                recent
              </div>
              <Recents artifacts={userData.artifact} />

              <div className="text-xs text-gray3 leading-[9px] uppercase mb-[23px] ml-8 mt-auto">
                essentials
              </div>
              <Essentials essentials={userData.essentials} />
            </>
          )}

          {subSection === "soundtrack" && <Soundtrack userId={pageUser?.id} />}

          {/*  */}
        </>
      )}
    </motion.div>
  );
};

export default User;

{
  /* Stats */
}
{
  /*<div className={`flex items-center mt-[44px] gap-8`}>*/
}
{
  /*  /!* Sounds Count *!/*/
}
{
  /*  <div className={`flex items-end gap-2 min-w-[4rem]`}>*/
}
{
  /*    <div className="text-xs text-gray3 leading-[9px] font-medium">*/
}
{
  /*      SOUND*/
}
{
  /*    </div>*/
}
{
  /*    <div className="text-gray4 font-baskerville text-[24px] leading-[16px]">*/
}
{
  /*      {userData.soundCount}**/
}
{
  /*    </div>*/
}
{
  /*  </div>*/
}

{
  /*  <div className={`flex items-end gap-[12px]`}>*/
}
{
  /*    <div className="text-xs text-gray3 leading-[9px] font-medium uppercase">*/
}
{
  /*      artifacts*/
}
{
  /*    </div>*/
}
{
  /*    <div className="text-gray4 font-baskerville text-[24px] leading-[16px]">*/
}
{
  /*      /!*{userData._count.record}*!/*/
}
{
  /*      44*/
}
{
  /*    </div>*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}

{
  /*{isOwnProfile ? (*/
}
{
  /*  <SettingsIcon*/
}
{
  /*    onClick={() => handleSubSectionClick("settings")}*/
}
{
  /*    className={`absolute left-0 bottom-0 bg-white rounded-full cursor-pointer`}*/
}
{
  /*  />*/
}
{
  /*) : (*/
}
{
  /*  <FollowButton*/
}
{
  /*    followState={followState}*/
}
{
  /*    handleFollowUnfollow={handleFollowUnfollow}*/
}
{
  /*    linkColor={linkColor}*/
}
{
  /*    linkText={linkText}*/
}
{
  /*  />*/
}
{
  /*)}*/
}
