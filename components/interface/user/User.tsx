import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { SettingsIcon, CardsIcon, TailIcon } from "@/components/icons";
import FollowButton from "./sub/components/Link";
import { UserType } from "@/types/dbTypes";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";

const scaleEntryConfig = { damping: 20, stiffness: 160 };

const SoundtrackButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button className={`p-2 rounded-full shadow-shadowKitHigh`} onClick={onClick}>
    <CardsIcon />
  </button>
);

const SettingsButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button className={`p-2 rounded-full shadow-shadowKitHigh`} onClick={onClick}>
    <SettingsIcon />
  </button>
);

const User = () => {
  const { user, pages, scrollContainerRef } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;
  const isOwnProfile = user?.id === pageUser?.id;

  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const [subSection, setSubSection] = useState<
    "essentials" | "settings" | "soundtrack"
  >("essentials");

  const handleSubSectionClick =
    (section: "essentials" | "settings" | "soundtrack") => () => {
      setSubSection(section === subSection ? "essentials" : section);
    };

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [1, 0.948]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  // const widthCardKeyframes = useTransform(scrollY, [0, 1], [576, 288]);
  // const widthCard = useSpring(widthCardKeyframes, scaleEntryConfig);

  const xCardKeyframes = useTransform(scrollY, [0, 1], [0, 9]);
  const xCard = useSpring(xCardKeyframes, scaleEntryConfig);

  const yCardKeyframes = useTransform(scrollY, [0, 1], [-1, 0]);
  const yCard = useSpring(yCardKeyframes, scaleEntryConfig);

  const borderCardKeyframes = useTransform(scrollY, [0, 1], [32, 24]);
  const borderCard = useSpring(borderCardKeyframes, scaleEntryConfig);

  const opacitySoundtrackKeyframes = useTransform(scrollY, [0, 1], [0, 1]);
  const opacitySoundtrack = useSpring(
    opacitySoundtrackKeyframes,
    scaleEntryConfig,
  );

  const opacityEssentialsKeyframes = useTransform(scrollY, [0, 1], [1, 0]);
  const opacityEssentials = useSpring(
    opacityEssentialsKeyframes,
    scaleEntryConfig,
  );

  const zSoundtrackKeyframes = useTransform(scrollY, [0, 1], [-10, 10]);

  const { userData } = data || {};

  if (!user || isLoading || isError) return <div>log in</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full flex flex-col mt-[1px]"
    >
      {/* Card Area */}
      <motion.div
        style={{
          scale: scaleCard,
          x: xCard,
          y: yCard,
          width: 576,
          height: 368,
          borderRadius: borderCard,
        }}
        className={`flex flex-col justify-between z-0 will-change-transform top-0 left-0 border border-silver`}
      >
        <div
          className={`absolute bg-white/40 w-full h-full top-0 left-0 backdrop-blur-3xl overflow-visible -z-10`}
        />
        <Essentials essentials={userData.essentials} />
        <div className={`flex flex-col gap-[22px] items-end pl-0 p-8 z-0`}>
          {/* Avatar */}
          <div className={`absolute left-4 bottom-4 flex items-center gap-4`}>
            <Image
              className={`rounded-max`}
              src={userData.image}
              alt={`${userData.name}'s avatar`}
              width={80}
              height={80}
            />
            <motion.div
              style={{
                opacity: opacityEssentials,
              }}
              className={`absolute left-[48px] -top-[7px] drop-shadow-md opacity-90`}
            >
              <div
                className={`bg-white rounded-[15px] py-1.5 px-[9px] text-xs w-max text-center`}
              >
                {userData.bio}
              </div>
              <TailIcon className={`absolute left-2 -translate-y-[2px]`} />
            </motion.div>

            <motion.div
              style={{
                opacity: opacityEssentials,
              }}
              className={`text-[24px] text-[#000] leading-[17px] font-medium`}
            >
              {userData.username}
            </motion.div>
          </div>
          {/* Stats */}
          <div className={`flex flex-col items-end gap-2`}>
            <div
              className={`text-xs text-gray2 leading-[9px] font-medium tracking-tight`}
            >
              sounds
            </div>
            <div
              className={`bg-[#F4F4F4] rounded-max text-sm text-gray5 leading-[10px] p-2 font-semibold`}
            >
              {userData._count.artifact}
            </div>
          </div>
          <div className={`flex flex-col items-end gap-2`}>
            <div
              className={`text-xs text-gray2 leading-[9px] font-medium tracking-tight`}
            >
              artifacts
            </div>
            <div
              className={`bg-[#F4F4F4] rounded-max text-sm text-gray5 leading-[10px] p-2 font-semibold`}
            >
              {userData._count.artifact}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Soundtrack History */}
      <motion.div className={`w-full h-full relative`}>
        <Soundtrack userId={user.id} />
      </motion.div>
    </motion.div>
  );
};

export default User;
{
  /* Buttons */
}
// <motion.div
//     initial={{ x: -16, y: 16 }}
//     animate={isOpen ? { x: -32, y: 32 } : { x: -16, y: 16 }}
//     transition={{ damping: 20, stiffness: 160 }}
//     className={`absolute flex flex-col items-center gap-4 top-0 right-0`}
// >
//   <SoundtrackButton onClick={handleSubSectionClick("soundtrack")} />
//   <SettingsButton onClick={handleSubSectionClick("settings")} />
// </motion.div>
