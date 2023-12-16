import React, { useState } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Recents from "@/components/interface/user/sub/Recents";
import Settings from "@/components/interface/user/sub/Settings";
import { useUser } from "@supabase/auth-helpers-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const pageUser = pages[pages.length - 1].user;
  const isOwnProfile = user?.id === pageUser?.id;

  const { scrollY } = useScroll({ container: scrollContainerRef });

  useMotionValueEvent(scrollY, "change", async (latest) => {
    if (latest > 1) {
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
    } else if (latest < 1) {
      setTimeout(() => {
        setIsOpen(false);
      }, 130);
    }
  });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [1, 0.948]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  const xCardKeyframes = useTransform(scrollY, [0, 1], [-1, 7]);
  const xCard = useSpring(xCardKeyframes, scaleEntryConfig);

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

  if (!user) return <div>log in</div>;
  if (isLoading) return;
  if (isError) return <div>Error</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full flex flex-col mt-[1px]"
    >
      {/* Card Area */}
      <motion.div
        style={{ scale: scaleCard, x: xCard, width: 352, height: 608 }}
        className={`flex rounded-full shadow-shadowKitHigh overflow-hidden z-0 will-change-transform top-0 left-0`}
      >
        <div
          className={`absolute bg-white/40 w-full h-full top-0 left-0 backdrop-blur-3xl overflow-visible -z-10`}
        />
        <Essentials essentials={userData.essentials} />
        <div className={`flex flex-col gap-[22px] items-end ml-auto p-8 z-0`}>
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

          {/* Avatar */}
          <div
            className={`absolute right-4 bottom-4 flex items-center flex-row-reverse gap-4`}
          >
            <Image
              className={`rounded-max min-w-[80px] shadow-userAvi`}
              src={userData.image}
              alt={`${userData.name}'s avatar`}
              width={80}
              height={80}
            />
            <div
              className={`absolute right-[40px] -top-[7px] drop-shadow-md opacity-90`}
            >
              <div
                className={`bg-white rounded-[15px] py-1.5 px-[9px] text-xs w-max text-center`}
              >
                {userData.bio}
              </div>
              <TailIcon
                className={`absolute right-2 -translate-y-[2px] scale-x-[-1]`}
              />
            </div>

            <div
              className={`text-[24px] text-[#000] leading-[17px] font-medium`}
            >
              {userData.username}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Soundtrack History */}
      {isOpen && <Soundtrack userId={user.id} />}
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
