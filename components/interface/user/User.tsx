import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
import { createPortal } from "react-dom";
import UserAvatar from "@/components/global/UserAvatar";
import Stars from "@/components/global/Stars";

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
  const { pages, scrollContainerRef } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useSpring(
    useTransform(scrollY, [0, 24], [1, 0.1667]),
    springConfig,
  );

  const x = useSpring(useTransform(scrollY, [0, 24], [0, -26]), springConfig);
  const y = useSpring(useTransform(scrollY, [0, 24], [0, 26]), springConfig);
  const opacity = useSpring(
    useTransform(scrollY, [0, 24], [0, 1]),
    springConfig,
  );
  // Check if the profile belongs to the authenticated user
  const isOwnProfile = authenticatedUserId === pageUser?.id;

  // State for active tab
  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );
  // Function to handle tab click
  const handleTabClick = (tab: "profile" | "soundtrack") => setActiveTab(tab);

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

  // State for subsection
  const [subSection, setSubSection] = useState<"essentials" | "settings">(
    "essentials",
  );
  // Function to handle subsection click
  const handleSubSectionClick = (section: "essentials" | "settings") =>
    setSubSection(section === subSection ? "essentials" : section);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full p-8 pt-0 mt-[216px]"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          <motion.div
            style={{ scale, x, y }}
            className={`fixed top-0 right-0 pointer-events-none origin-top-right flex w-full h-full items-center justify-center`}
          >
            <Image
              className={`rounded-full shadow-shadowKitMedium`}
              src={userData.image}
              alt={`${userData.name}'s avatar`}
              width={384}
              height={384}
            />
          </motion.div>
          <motion.div
            className={`text-[22px] leading-[22px] font-bold text-gray4 fixed top-[53px] right-[112px] tracking-tighter`}
          >
            {userData.username}
          </motion.div>

          <motion.div
            style={{ opacity }}
            className={`flex flex-col gap-8 h-full`}
          >
            {/*  Interactions */}
            <div className={`flex flex-col gap-4`}>
              <div className={`flex items-center gap-2`}>
                <LinkButton color={"#CCC"} />
                <FollowButton
                  followState={followState}
                  handleFollowUnfollow={handleFollowUnfollow}
                  linkColor={linkColor}
                  linkText={linkText}
                />
              </div>
              <div className={`flex items-center gap-2`}>
                <RecordsButton color={"#CCC"} />
                <div className={`uppercase text-xs text-gray3`}>RECORDS</div>
              </div>
              <div className={`flex items-center gap-2`}>
                <ArchiveButton color={"#CCC"} />
                <div className={`uppercase text-xs text-gray3`}>ARCHIVE</div>
              </div>
            </div>
            {/* Essentials */}
            <div className="flex w-max items-center rounded-xl">
              <Essentials essentials={essentials} />
            </div>
          </motion.div>
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
//   <div className="flex flex-col gap-[10px]">
//     <div className="text-xs text-gray2 leading-none cursor-pointer">
//       LINKS
//     </div>
//     <div className={`flex items-center gap-2`}>
//       <div className="text-black text-sm leading-none">
//         {userData._count.followers}
//       </div>
//       {/* Followers Images */}
//       <div className="flex -space-x-4">
//         {/*@ts-ignore/*/}
//         {userData.followers.map(({ follower }) => (
//             <Image
//                 key={follower.id}
//                 className="rounded-full w-[16px] h-[16px]" // Adjust
//                 src={follower.image}
//                 alt={`${follower.username}'s avatar`}
//                 width={16}
//                 height={16}
//             />
//         ))}
//       </div>
//     </div>
//   </div>
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
