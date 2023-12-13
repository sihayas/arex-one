import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Recents from "@/components/interface/user/sub/Recents";
import Settings from "@/components/interface/user/sub/Settings";
import { useUser } from "@supabase/auth-helpers-react";
import { SettingsIcon, CardsIcon } from "@/components/icons";
import FollowButton from "./sub/components/Link";
import { UserType } from "@/types/dbTypes";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";

const SoundtrackButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button className={`p-2 rounded-full shadow-shadowKitLow`} onClick={onClick}>
    <CardsIcon />
  </button>
);

const SettingsButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button className={`p-2 rounded-full shadow-shadowKitLow`} onClick={onClick}>
    <SettingsIcon />
  </button>
);

const User = () => {
  const { user, pages } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;
  const isOwnProfile = user?.id === pageUser?.id;

  const [subSection, setSubSection] = useState<
    "essentials" | "settings" | "soundtrack"
  >("essentials");

  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const isSoundtrack = subSection === "soundtrack";
  const isEssentials = subSection === "essentials";

  const handleSubSectionClick =
    (section: "essentials" | "settings" | "soundtrack") => () => {
      setSubSection(section === subSection ? "essentials" : section);
    };

  const { userData } = data || {};

  if (isLoading) return;
  if (isError) return <div>Error</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col relative"
    >
      {/* Header */}
      <div
        className={`fixed z-[100] top-0 flex justify-between gap-8 p-8 w-full h-fit`}
      >
        {/* Text Info & Avatar */}
        <motion.div
          initial={{ y: 32 }}
          animate={!isEssentials ? { y: 0 } : { y: 32 }}
          className={`flex flex-col w-full`}
        >
          <div
            className={`text-[24px] text-black leading-[17px] font-semibold`}
          >
            {userData.username}
          </div>

          {isEssentials && (
            <div
              className={`text-sm text-gray2 w-full max-h-[288px] line-clamp-5 mt-[9px] transition ${
                !isEssentials && "opacity-0"
              }`}
            >
              {userData.bio}
            </div>
          )}

          {isSoundtrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isSoundtrack ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[24px] text-gray3 leading-[17px] font-semibold mt-[14px]`}
            >
              entries
            </motion.div>
          )}
        </motion.div>

        <motion.div
          animate={subSection !== "essentials" ? { scale: 0.5 } : { scale: 1 }}
          className={`min-w-[96px] flex origin-top-right ${
            !isEssentials && `cursor-pointer`
          }`}
          onClick={handleSubSectionClick("essentials")}
        >
          <Image
            className={`rounded-full border border-silver min-w-[96px] shadow-userAvi`}
            src={userData.image}
            alt={`${userData.name}'s avatar`}
            width={96}
            height={96}
          />
        </motion.div>

        <motion.div
          animate={subSection !== "essentials" ? { scale: 0 } : { scale: 1 }}
          className={`flex items-center gap-4 absolute -bottom-1 right-[44px] origin-center`}
        >
          <SoundtrackButton onClick={handleSubSectionClick("soundtrack")} />
          <SettingsButton onClick={handleSubSectionClick("settings")} />
        </motion.div>
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
    </motion.div>
  );
};

export default User;
