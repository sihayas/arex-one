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

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile"
  );
  const handleTabClick = (tab: "profile" | "soundtrack") => setActiveTab(tab);

  // components/interface/user/User.tsx

  const {
    data,
    isLoading,
    isError,
    followState,
    handleFollow,
    handleUnfollow,
  } = useUserDataAndAlbumsQuery(pageUser!.id, authenticatedUserId!);
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
          key="jelly"
          isVisible={true}
        />
      ) : isError ? (
        <div>Error</div>
      ) : (
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
                onClick={() => handleTabClick("profile")}
                src={userData.image}
                alt={`${userData.name}'s avatar`}
                width={64}
                height={64}
              />
              <div className="flex flex-col gap-[10px] text-end mt-[48px]">
                <div className="text-xs text-gray3 leading-none font-medium tracking-widest">
                  EVER SINCE
                </div>
                <div className="text-black text-sm leading-none">
                  {format(new Date(userData.dateJoined), "MM.dd.yy")}
                </div>
              </div>
              <div className="flex flex-col gap-[10px] text-end">
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
          {activeTab === "soundtrack" && pageUser && (
            <Soundtrack userId={pageUser.id} />
          )}
          {/* <button
            onClick={followState.followingAtoB ? handleUnfollow : handleFollow}
          >
            {followState.followingAtoB ? "Unfollow" : "Follow"}
          </button> */}
        </motion.div>
      )}
    </motion.div>
  );
};

export default User;
