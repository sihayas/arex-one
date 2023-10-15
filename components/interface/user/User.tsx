import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import { follow, getUserDataAndAlbums, unfollow } from "@/lib/api/userAPI";
import Essentials from "@/components/interface/user/sub/components/Essentials";
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

  const { pages } = useInterfaceContext();

  // User IDs
  const authenticatedUserId = user?.id;
  // const pageUser = pages[pages.length - 1].user;
  // const isOwnProfile = authenticatedUserId === pageUser!.id;

  // Store following status
  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const linkStatus =
    followingAtoB && followingBtoA
      ? "INTERLINKED"
      : followingAtoB
      ? "LINKED"
      : followingBtoA
      ? "INTERLINK"
      : "LINK";

  const { text: linkText, color: linkColor } = linkProps[linkStatus];

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );

  // Get comprehensive user data
  // const { data, isLoading, isError } = useQuery(
  //   ["userDataAndAlbums", pageUser ? pageUser.id : undefined],
  //   () =>
  //     pageUser ? getUserDataAndAlbums(pageUser.id, authenticatedUserId!) : null,
  // );

  // const { userData, albumsData } = data || {};

  // useEffect(() => {
  //   if (userData) {
  //     setFollowingAtoB(userData.isFollowingAtoB);
  //     setFollowingBtoA(userData.isFollowingBtoA);
  //   }
  // }, [userData]);

  const handleSoundtrackClick = () => {
    setActiveTab("soundtrack");
  };

  const handleImageClick = () => {
    setActiveTab("profile");
  };

  // const handleFollow = async () => {
  //   if (!authenticatedUserId || !pageUser) {
  //     console.log("User is not signed in or user to follow/unfollow not found");
  //     return;
  //   }
  //   setLoadingFollow(true);
  //   try {
  //     followingAtoB
  //       ? await unfollow(authenticatedUserId, pageUser.id)
  //       : await follow(authenticatedUserId, pageUser.id);
  //     setFollowingAtoB(!followingAtoB);
  //   } catch (error) {
  //     console.error("Error following/unfollowing", error);
  //   } finally {
  //     setLoadingFollow(false);
  //   }
  // };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {/*{isLoading ? (*/}
      {/*  <JellyComponent*/}
      {/*    className={*/}
      {/*      "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"*/}
      {/*    }*/}
      {/*    key="jelly"*/}
      {/*    isVisible={true}*/}
      {/*  />*/}
      {/*) : isError ? (*/}
      {/*  <div>Error</div>*/}
      {/*) : (*/}
      {/*  <>*/}
      {/*    /!* Content Outer *!/*/}
      {/*    <motion.div*/}
      {/*      initial={{ x: 0 }}*/}
      {/*      animate={{ x: activeTab === "soundtrack" ? "-352px" : "0px" }}*/}
      {/*      transition={{ type: "spring", stiffness: 880, damping: 80 }}*/}
      {/*      className="w-[200%] h-full flex"*/}
      {/*    >*/}
      {/*      <div className="w-1/2 h-full flex flex-col p-8 justify-between">*/}
      {/*        <div className="flex flex-col gap-7 mt-5">*/}
      {/*          <div className="text-sm text-black font-medium leading-none">*/}
      {/*            {userData.name}*/}
      {/*          </div>*/}
      {/*          /!* Since *!/*/}
      {/*          <div className="flex flex-col gap-[10px]">*/}
      {/*            <div className="text-xs text-gray2 font-mono leading-none">*/}
      {/*              SINCE*/}
      {/*            </div>*/}
      {/*            <div className="text-black font-medium text-sm leading-none">*/}
      {/*              {format(new Date(userData.dateJoined), "MM.dd.yy")}*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          /!* Sounds *!/*/}
      {/*          <div className="flex flex-col gap-[10px]">*/}
      {/*            <div*/}
      {/*              onClick={handleSoundtrackClick}*/}
      {/*              className="text-xs text-gray2 font-mono leading-none cursor-pointer"*/}
      {/*            >*/}
      {/*              UNIQUE SOUNDS*/}
      {/*            </div>*/}
      {/*            <div className="text-black font-medium text-sm leading-none">*/}
      {/*              {userData.uniqueAlbums.length}*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          /!* Following / Followers *!/*/}
      {/*          <div className="flex flex-col gap-[10px]">*/}
      {/*            <div className="text-xs text-gray2 font-mono leading-none">*/}
      {/*              LINKS*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center gap-2">*/}
      {/*              <div className="w-2 h-2 bg-black rounded-full" />*/}
      {/*              <div className="text-black font-medium text-sm leading-none">*/}
      {/*                {userData._count.followers}*/}
      {/*              </div>*/}

      {/*              <div className="w-2 h-2 bg-[#FFEA00] rounded-full ml-2" />*/}
      {/*              <div className="text-[#FFEA00] font-medium text-sm leading-none">*/}
      {/*                {userData._count.followers}*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        <Essentials favorites={albumsData} />*/}
      {/*      </div>*/}

      {/*      {activeTab === "soundtrack" && pageUser ? (*/}
      {/*        <Soundtrack userId={pageUser.id} />*/}
      {/*      ) : null}*/}
      {/*    </motion.div>*/}
      {/*    <Image*/}
      {/*      className={`fixed top-8 right-8 rounded-full outline outline-black outline-[.5px]`}*/}
      {/*      onClick={handleImageClick}*/}
      {/*      src={userData.image}*/}
      {/*      alt={`${userData.name}'s avatar`}*/}
      {/*      width={64}*/}
      {/*      height={64}*/}
      {/*    />*/}
      {/*  </>*/}
      {/*)}*/}
    </div>
  );
};

export default User;
