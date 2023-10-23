import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { useUserDataAndAlbumsQuery } from "@/lib/apiHandlers/userAPI";
import Essentials from "@/components/interface/user/sub/Essentials";
import { format } from "date-fns";
import { JellyComponent } from "@/components/global/Loading";
import { useUser } from "@supabase/auth-helpers-react";
import { SettingsIcon } from "@/components/icons";

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
  const { userData, albumsData } = data || {};

  const linkStatus =
    followState?.followingAtoB && followState?.followingBtoA
      ? "INTERLINKED"
      : followState?.followingAtoB
      ? "LINKED"
      : followState?.followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

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
            <Essentials favorites={albumsData} />
            <div className="flex items-center fixed top-4 right-4 gap-2">
              {isOwnProfile ? (
                <SettingsIcon />
              ) : (
                // Follow button
                <button
                  onClick={() =>
                    followState.followingAtoB
                      ? handleFollowUnfollow("unfollow")
                      : handleFollowUnfollow("follow")
                  }
                  className="flex items-center gap-2 text-xs"
                  style={{ color: linkColor }}
                >
                  {linkText}
                  <div
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: linkColor }}
                  />
                </button>
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
