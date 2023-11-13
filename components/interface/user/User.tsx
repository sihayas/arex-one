import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { useUserDataAndAlbumsQuery } from "@/lib/apiHandlers/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import {
  RecordsButton,
  LinkButton,
  SettingsIcon,
  ArchiveButton,
} from "@/components/icons";
import FollowButton from "./sub/components/LinkButton";
import { User } from "@/types/dbTypes";

// Define link properties for different states
const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};
const springConfig = { damping: 40, stiffness: 400, mass: 1 };

// User component
const User = () => {
  const user = useUser();
  const authenticatedUserId = user?.id;

  // Get page user
  const {
    pages,
    scrollContainerRef,
    feedUserHistory,
    setFeedUserHistory,
    setActiveFeedUser,
    setIsVisible,
  } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

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
      className="w-full h-full flex justify-between px-8"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Left Side */}
          <div className={`flex flex-col py-8`}>
            {/* Avatar and Link */}
            <div className={`flex items-center gap-4`}>
              <Image
                className={`rounded-full`}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={64}
                height={64}
              />

              <FollowButton
                followState={followState}
                handleFollowUnfollow={handleFollowUnfollow}
                linkColor={linkColor}
                linkText={linkText}
              />
            </div>

            {/* Name and Bio */}
            <div className={`flex flex-col gap-[6px] mt-3`}>
              <div
                className={`text-sm font-semibold text-gray4 leading-[10px]`}
              >
                {userData.username}
              </div>
              <div className={`text-xs text-gray2 w-[160px] h-[84px]`}>
                {userData.bio}
              </div>
            </div>

            {/*  Sounds Count */}
            <div className={`flex flex-col gap-[12px] mt-[201px]`}>
              <div className="text-xs text-gray3 leading-[9px]">SOUNDS</div>
              <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                {userData.uniqueAlbums.length}
              </div>
            </div>

            {/*  Records Count */}
            <div className={`flex flex-col gap-[12px] mt-[55px]`}>
              <div className="text-xs text-gray3 leading-[9px]">RECORDS</div>
              <div className="text-gray4 font-baskerville text-[30px] leading-[20px]">
                {userData._count.record}
              </div>
            </div>

            {/* Logo and Date */}
            <div className={`flex items-center mt-auto text-gray3`}>
              <div className="text-[19px] leading-[13px] text-black font-serif">
                RX
              </div>
              <div className={`mx-1`}>&middot;</div>
              <div className="text-xs text-gray3 font-bold leading-[9px]">
                MONTH 1
              </div>
            </div>
            {/*  */}
          </div>

          {/* Right */}
          <Essentials essentials={essentials} />
        </>
      )}
    </motion.div>
  );
};

// Export User component
export default User;

{
  /* Statistics */
}
{
  /* Sounds */
}

{
  /* Followers / Links */
}
{
  /*<div className="flex flex-col gap-[10px]">*/
}
{
  /*  <div className="text-xs text-gray3 leading-none cursor-pointer">*/
}
{
  /*    LINKS*/
}
{
  /*  </div>*/
}
{
  /*  <div className={`flex items-center gap-2 ml-8`}>*/
}
{
  /*    <div className="text-black text-sm leading-none">*/
}
{
  /*      {userData._count.followers}*/
}
{
  /*    </div>*/
}
{
  /*    /!* Followers Images *!/*/
}
{
  /*    <div className="flex -space-x-4">*/
}
{
  /*      /!*@ts-ignore/*!/*/
}
{
  /*      {userData.followers.map(({ follower }) => (*/
}
{
  /*          <Image*/
}
{
  /*              key={follower.id}*/
}
{
  /*              className="rounded-full w-[16px] h-[16px]" // Adjust*/
}
{
  /*              src={follower.image}*/
}
{
  /*              alt={`${follower.username}'s avatar`}*/
}
{
  /*              width={16}*/
}
{
  /*              height={16}*/
}
{
  /*          />*/
}
{
  /*      ))}*/
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
  /*  Interactions */
}
{
  /*<div className={`flex flex-col gap-4`}>*/
}
{
  /*  <div className={`flex items-center gap-2`}>*/
}
{
  /*    {isOwnProfile ? (*/
}
{
  /*        <SettingsIcon*/
}
{
  /*            className={``}*/
}
{
  /*            onClick={() => handleSubSectionClick("settings")}*/
}
{
  /*        />*/
}
{
  /*    ) : (*/
}
{
  /*        <>*/
}
{
  /*          <LinkButton color={"#CCC"} />*/
}
{
  /*          <FollowButton*/
}
{
  /*              followState={followState}*/
}
{
  /*              handleFollowUnfollow={handleFollowUnfollow}*/
}
{
  /*              linkColor={linkColor}*/
}
{
  /*              linkText={linkText}*/
}
{
  /*          />*/
}
{
  /*        </>*/
}
{
  /*    )}*/
}
{
  /*  </div>*/
}
{
  /*  <div*/
}
{
  /*      onClick={() => handleSetFeedUser(userData)}*/
}
{
  /*      className={`flex items-center gap-2 cursor-pointer`}*/
}
{
  /*  >*/
}
{
  /*    <RecordsButton color={"#CCC"} />*/
}
{
  /*    <div className={`uppercase text-xs text-gray3`}>RECORDS</div>*/
}
{
  /*  </div>*/
}
{
  /*  <div className={`flex items-center gap-2`}>*/
}
{
  /*    <ArchiveButton color={"#CCC"} />*/
}
{
  /*    <div className={`uppercase text-xs text-gray3`}>ARCHIVE</div>*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}

{
  /* Statistics */
}
// <div className={`flex gap-8 items-center`}>
//   <div className="flex flex-col gap-[10px]">
//     <div
//         onClick={() => handleTabClick("soundtrack")}
//         className="text-xs text-gray2 leading-none cursor-pointer"
//     >
//       SOUNDS
//     </div>
//     <div className="text-black text-sm leading-none">
//       {userData.uniqueAlbums.length}
//     </div>
//   </div>
//   {/* Stat 1 */}
//
// </div>
{
  /*{isOwnProfile ? (*/
}
{
  /*  <SettingsIcon*/
}
{
  /*    className={`ml-auto mr-4`}*/
}
{
  /*    onClick={() => handleSubSectionClick("settings")}*/
}
{
  /*  />*/
}
{
  /*) : (*/
}

{
  /*)}*/
}
//
// <div
//     onClick={() => handleTabClick("soundtrack")}
//     className={`flex items-center gap-2`}
// ></div>

//
// <motion.div>
//   {/* Profile Card */}
//   <div className="w-1/2 h-full flex flex-col p-8">
//     {/* Name & Avatar */}
//     <div className={`flex flex-col items-center gap-[22px]`}>
//       <Image
//           className={`rounded-full w-[128px] h-[128px] shadow-shadowKitMedium`}
//           src={userData.image}
//           alt={`${userData.name}'s avatar`}
//           width={128}
//           height={128}
//       />
//       <div className="text-sm tracking-tighter font-bold leading-none text-gray4">
//         {userData.username}
//       </div>
//     </div>
//
//     <div className={`flex flex-col text-sm items-end mt-[21px] gap-2`}>
//       <div className={`flex items-center gap-1`}>
//         <div className={`text-gray2`}>{userData._count.record}</div>
//         <div className={`text-gray2`}>&middot;</div>
//         <div className={`text-gray2 uppercase mr-1`}>RECORDS</div>
//         <RecordsIcon className={"opacity-20"} />
//       </div>
//       <div className={`flex items-center gap-1`}>
//         <div className={`text-gray2 uppercase mr-1`}>LINK</div>
//         <LinkIcon className={"opacity-20"} />
//       </div>
//     </div>
//
//     <AnimatePresence>
//       {subSection === "essentials" ? (

//       ) : isOwnProfile && authenticatedUserId ? (
//           // Show settings if subsection is settings and its own profile
//           <Settings
//               userId={authenticatedUserId}
//               essentials={essentials}
//           />
//       ) : (
//           // Show essentials by default
//           <Essentials essentials={essentials} />
//       )}
//     </AnimatePresence>
//
//     <div className="flex items-center fixed bottom-4 left-4 gap-2"></div>
//   </div>
//   {activeTab === "soundtrack" && pageUser && (
//       <Soundtrack userId={pageUser.id} />
//   )}
// </motion.div>
