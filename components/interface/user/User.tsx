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

  const widthCardKeyframes = useTransform(scrollY, [0, 1], [352, 144]);
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
          y: yCard,
          width: widthCard,
          height: 528,
          borderRadius: borderCard,
        }}
        className={`flex justify-between overflow-hidden z-0 will-change-transform top-0 left-0 bg-black/10 `}
      >
        {/*<div*/}
        {/*  className={`absolute bg-black/10 w-full h-full top-0 left-0 backdrop-blur-2xl overflow-visible -z-10`}*/}
        {/*/>*/}

        <div className={`flex flex-col p-8 z-0 gap-2`}>
          {/* Avatar */}
          <div className={`flex items-center flex-row-reverse gap-4 relative`}>
            <Image
              className={`rounded-max`}
              src={userData.image}
              alt={`${userData.name}'s avatar`}
              width={80}
              height={80}
            />

            <motion.div
              className={`absolute center-y text-base text-gray4 leading-[11px] font-semibold w-max left-24 tracking-tight`}
            >
              {userData.username}
            </motion.div>
            {/*<motion.div className={`absolute left-12 top-0`}>*/}
            {/*  <div*/}
            {/*    className={`bg-white rounded-[15px] py-1.5 px-[9px] text-sm w-max text-center`}*/}
            {/*  >*/}
            {/*    {userData.bio}*/}
            {/*  </div>*/}
            {/*  <TailIcon className={`absolute left-2 -translate-y-[2px]`} />*/}
            {/*</motion.div>*/}
          </div>

          {/*  Filter Line */}
          <Statline />
        </div>

        <Essentials essentials={userData.essentials} />
      </motion.div>
      {/* Soundtrack History */}
      <motion.div
        style={{
          opacity: opacitySoundtrack,
          zIndex: zSoundtrackKeyframes,
          overflow: "visible",
        }}
      >
        <Soundtrack userId={user.id} />
      </motion.div>
    </motion.div>
  );
};

export default User;
