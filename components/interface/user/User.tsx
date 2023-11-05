import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AnimatePresence, motion } from "framer-motion";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { useUserDataAndAlbumsQuery } from "@/lib/apiHandlers/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import { ArrowCircleIcon, SettingsIcon } from "@/components/icons";
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

  console.log("USER DATA", userData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex flex-col"
    >
      {isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : isError ? (
        <div>Error</div>
      ) : (
        // Render user profile and soundtrack
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: activeTab === "soundtrack" ? "-640px" : "0px" }}
          transition={{ type: "spring", stiffness: 880, damping: 80 }}
          className="w-[200%] h-full flex"
        >
          <div className="w-1/2 h-full flex flex-col p-8">
            {/* Name & Avatar */}
            <div className={`flex justify-between items-center`}>
              {/* Username */}
              <div className="text-[22px] tracking-tighter font-bold leading-none text-gray4">
                @{userData.username}
              </div>
              {isOwnProfile ? (
                <SettingsIcon
                  className={`ml-auto mr-4`}
                  onClick={() => handleSubSectionClick("settings")}
                />
              ) : (
                <FollowButton
                  followState={followState}
                  handleFollowUnfollow={handleFollowUnfollow}
                  linkColor={linkColor}
                  linkText={linkText}
                />
              )}
              <Image
                className={`rounded-full border border-gray3 w-[128px] h-[128px]`}
                onClick={() => handleTabClick("profile")}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={128}
                height={128}
              />
            </div>

            {/* Statistics */}
            <div className={`flex gap-8 items-center`}>
              <div className="flex flex-col gap-[10px]">
                <div
                  onClick={() => handleTabClick("soundtrack")}
                  className="text-xs text-gray2 leading-none cursor-pointer"
                >
                  SOUNDS
                </div>
                <div className="text-black text-sm leading-none">
                  {userData.uniqueAlbums.length}
                </div>
              </div>
              {/* Stat 1 */}
              <div className="flex flex-col gap-[10px]">
                <div className="text-xs text-gray2 leading-none cursor-pointer">
                  LINKS
                </div>
                <div className={`flex items-center gap-2`}>
                  <div className="text-black text-sm leading-none">
                    {userData._count.followers}
                  </div>
                  {/* Followers Images */}
                  <div className="flex -space-x-4">
                    {/*@ts-ignore/*/}
                    {userData.followers.map(({ follower }) => (
                      <Image
                        key={follower.id}
                        className="rounded-full w-[16px] h-[16px]" // Adjust
                        src={follower.image}
                        alt={`${follower.username}'s avatar`}
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {subSection === "essentials" ? (
                // Show essentials if subsection is essentials
                <div className="flex gap-x-4 h-fit w-full items-center mt-auto">
                  <Essentials essentials={essentials} />
                  <div
                    onClick={() => handleTabClick("soundtrack")}
                    className={`flex items-center gap-2`}
                  >
                    <ArrowCircleIcon color={`#999`} />
                    <div className={`text-xs text-gray2 uppercase`}>
                      soundtrack
                    </div>
                  </div>
                </div>
              ) : isOwnProfile && authenticatedUserId ? (
                // Show settings if subsection is settings and its own profile
                <Settings
                  userId={authenticatedUserId}
                  essentials={essentials}
                />
              ) : (
                // Show essentials by default
                <Essentials essentials={essentials} />
              )}
            </AnimatePresence>

            <div className="flex items-center fixed bottom-4 left-4 gap-2"></div>
          </div>
          {activeTab === "soundtrack" && pageUser && (
            <Soundtrack userId={pageUser.id} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Export User component
export default User;

{
  /* Essentials */
}
