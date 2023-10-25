import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AnimatePresence, motion } from "framer-motion";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { useUserDataAndAlbumsQuery } from "@/lib/apiHandlers/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { format } from "date-fns";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import { SettingsIcon } from "@/components/icons";
import FollowButton from "./sub/components/LinkButton";

// Define link properties for different states
const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

// User component
const User = () => {
  // Get current user
  const user = useUser();
  const authenticatedUserId = user?.id;

  // Get page user
  const { pages } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;
  // Check if the profile belongs to the authenticated user
  const isOwnProfile = authenticatedUserId === pageUser?.id;

  // State for active tab
  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile"
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
    "essentials"
  );
  // Function to handle subsection click
  const handleSubSectionClick = (section: "essentials" | "settings") =>
    setSubSection(section === subSection ? "essentials" : section);

  console.log(userData);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex flex-col"
    >
      {isLoading ? (
        // Show loading component if data is loading
        <JellyComponent
          className={
            "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
          }
          isVisible={true}
        />
      ) : isError ? (
        // Show error message if there is an error
        <div>Error</div>
      ) : (
        // Render user profile and soundtrack
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: activeTab === "soundtrack" ? "-352px" : "0px" }}
          transition={{ type: "spring", stiffness: 880, damping: 80 }}
          className="w-[200%] h-full flex"
        >
          <div className="w-1/2 h-full flex flex-col p-8 items-end">
            {/* Essentials */}
            <AnimatePresence>
              {subSection === "essentials" ? (
                // Show essentials if subsection is essentials
                <Essentials essentials={essentials} />
              ) : isOwnProfile && authenticatedUserId ? (
                // Show settings if subsection is settings and it's own profile
                <Settings
                  userId={authenticatedUserId}
                  essentials={essentials}
                />
              ) : (
                // Show essentials by default
                <Essentials essentials={essentials} />
              )}
            </AnimatePresence>
            <h1 className="text-xs text-gray3 font-medium tracking-widest uppercase mt-4 ml-auto mr-auto leading-[75%]">
              essentials
            </h1>

            {/* Biography */}
            <div className="text-sm text-gray2 mt-[51px] w-full text-start">
              {userData.bio || ""}
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-[10px] text-end mt-auto">
              <div className="text-black text-sm leading-none">
                {userData.uniqueAlbums.length}
              </div>
              <div
                onClick={() => handleTabClick("soundtrack")}
                className="text-xs text-gray3 leading-none font-medium tracking-widest cursor-pointer"
              >
                UNIQUE SOUNDS
              </div>
            </div>
            {/* Stat 1 */}
            <div className="flex flex-col gap-[10px] text-end mt-8 ">
              <div className="text-black text-sm leading-none">
                {format(new Date(userData.dateJoined), "MMMM dd")}
              </div>
              <div className="text-xs text-gray3 leading-none font-medium tracking-widest">
                RX SINCE
              </div>
            </div>

            {/* Avatar */}
            <div className="flex items-center fixed bottom-4 left-4 gap-2">
              <Image
                className={`rounded-full outline outline-silver outline-[1.5px]`}
                onClick={() => handleTabClick("profile")}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={64}
                height={64}
              />
              {isOwnProfile ? (
                // Show settings icon if it's own profile
                <SettingsIcon
                  onClick={() => handleSubSectionClick("settings")}
                />
              ) : (
                // Show follow button if it's not own profile
                <FollowButton
                  followState={followState}
                  handleFollowUnfollow={handleFollowUnfollow}
                  linkColor={linkColor}
                  linkText={linkText}
                />
              )}
            </div>
          </div>
          {activeTab === "soundtrack" && pageUser && (
            // Show soundtrack if active tab is soundtrack
            <Soundtrack userId={pageUser.id} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Export User component
export default User;
