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

const linkProps = {
  INTERLINKED: { text: "INTERLINKED", color: "#00FF00" },
  LINKED: { text: "LINKED", color: "#000" },
  INTERLINK: { text: "INTERLINK", color: "#FFEA00" },
  LINK: { text: "LINK", color: "#CCC" },
};

const User = () => {
  const user = useUser();
  const authenticatedUserId = user?.id;

  const { pages } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;
  const isOwnProfile = authenticatedUserId === pageUser?.id;

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile"
  );
  const handleTabClick = (tab: "profile" | "soundtrack") => setActiveTab(tab);

  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataAndAlbumsQuery(pageUser?.id, authenticatedUserId);
  const { userData, essentials } = data || {};

  const linkStatus =
    followState?.followingAtoB && followState?.followingBtoA
      ? "INTERLINKED"
      : followState?.followingAtoB
      ? "LINKED"
      : followState?.followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  const [subSection, setSubSection] = useState<"essentials" | "settings">(
    "essentials"
  );
  const handleSubSectionClick = (section: "essentials" | "settings") =>
    setSubSection(section === subSection ? "essentials" : section);

  console.log(essentials);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex flex-col"
    >
      {isLoading ? (
        <JellyComponent
          className={
            "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
          }
          isVisible={true}
        />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: activeTab === "soundtrack" ? "-352px" : "0px" }}
          transition={{ type: "spring", stiffness: 880, damping: 80 }}
          className="w-[200%] h-full flex"
        >
          <div className="w-1/2 h-full flex flex-col p-8">
            <div className="flex items-center fixed top-4 right-4 gap-2">
              {isOwnProfile ? (
                <SettingsIcon
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
                className={`rounded-full outline outline-silver outline-[1.5px]`}
                onClick={() => handleTabClick("profile")}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={64}
                height={64}
              />
            </div>
            {/* Stat 1 */}
            <div className="flex flex-col gap-[10px]">
              <div className="text-xs text-gray3 leading-none font-medium tracking-widest">
                RX SINCE
              </div>
              <div className="text-black text-sm leading-none">
                {format(new Date(userData.dateJoined), "MMMM dd")}
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col gap-[10px] mt-8">
              <div
                onClick={() => handleTabClick("soundtrack")}
                className="text-xs text-gray3 leading-none font-medium tracking-widest cursor-pointer"
              >
                UNIQUE SOUNDS
              </div>
              <div className="text-black text-sm leading-none">
                {userData.uniqueAlbums.length}
              </div>
            </div>
            {/* Subsection (Favorites or Settings) */}
            <AnimatePresence>
              {subSection === "essentials" ? (
                <Essentials essentials={essentials} />
              ) : isOwnProfile && authenticatedUserId ? (
                <Settings
                  userId={authenticatedUserId}
                  essentials={essentials}
                />
              ) : (
                <Essentials essentials={essentials} />
              )}
            </AnimatePresence>
          </div>
          {activeTab === "soundtrack" && pageUser && (
            <Soundtrack userId={pageUser.id} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default User;
