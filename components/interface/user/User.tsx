import React from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { SettingsIcon, TailIcon } from "@/components/icons";
import FollowButton from "./sub/components/Link";
import Soundtrack from "@/components/interface/user/sub/Soundtrack";
import Statline from "@/components/interface/user/sub/Statline";

const scaleEntryConfig = { damping: 20, stiffness: 160 };

const User = () => {
  const { user, pages, scrollContainerRef } = useInterfaceContext();
  const pageUser = pages[pages.length - 1].user;

  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [1, 0.948]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  const widthCardKeyframes = useTransform(scrollY, [0, 1], [656, 144]);
  const widthCard = useSpring(widthCardKeyframes, scaleEntryConfig);

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

  const zSoundtrackKeyframes = useTransform(scrollY, [0, 1], [-10, 10]);

  const { userData } = data || {};

  if (!user || isLoading || isError) return <div>log in</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full flex"
    >
      {/* Card Area */}
      <motion.div
        style={{
          scale: scaleCard,
          x: xCard,
          // y: yCard,
          width: widthCard,
          borderRadius: borderCard,
        }}
        className={`pl-8 pb-8 flex justify-between overflow-hidden z-0 will-change-transform top-0 left-0 min-h-full`}
      >
        <div
          className={`absolute bg-black/5 w-full h-full top-0 left-0 backdrop-blur-2xl overflow-visible -z-10`}
        />

        <Statline userData={userData} />

        <div className={`ml-2 mt-auto gap-4 relative`}>
          <Image
            className={`rounded-max shadow-shadowKitHigh`}
            src={userData.image}
            alt={`${userData.name}'s avatar`}
            width={64}
            height={64}
          />
          <div
            className={`absolute flex flex-col center-y left-[72px] w-max gap-3`}
          >
            <div
              className={`font-medium tracking-tight text-base leading-[11px] text-gray2`}
            >
              {userData.username}
            </div>
          </div>
        </div>

        <Essentials essentials={userData.essentials} />
      </motion.div>
      {/* Soundtrack History */}
      {/*<motion.div*/}
      {/*  style={{*/}
      {/*    opacity: opacitySoundtrack,*/}
      {/*    zIndex: zSoundtrackKeyframes,*/}
      {/*    overflow: "visible",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Soundtrack userId={user.id} />*/}
      {/*</motion.div>*/}
    </motion.div>
  );
};

export default User;

// {/*<motion.div className={`absolute left-12 top-0`}>*/}
// {/*  <div*/}
// {/*    className={`bg-white rounded-[15px] py-1.5 px-[9px] text-sm w-max text-center`}*/}
// {/*  >*/}
// {/*    {userData.bio}*/}
// {/*  </div>*/}
// {/*  <TailIcon className={`absolute left-2 -translate-y-[2px]`} />*/}
// {/*</motion.div>*/}
