import React, { useState } from "react";
import { useInterfaceContext } from "@/context/Interface";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/entry/render/Replies";
import Chain from "@/components/interface/entry/render/Chain";
import { EntryExtended } from "@/types/global";

import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { Interaction } from "@/components/global/Interaction";
import { createPortal } from "react-dom";
import { getStarComponent } from "@/components/global/Star";

export const Entry = () => {
  const [tiltAngles, setTiltAngles] = useState({
    tiltAngleX: 0,
    tiltAngleY: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const { activePage, scrollContainerRef, pages, user } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const x = useSpring(0, { damping: 320, stiffness: 80 });
  const y = useSpring(0, { damping: 320, stiffness: 80 });

  const entry = activePage.data as EntryExtended;

  // If opening from a notification, load the chain
  // const chainId = activePage.data?.replyTo;

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const sound = entry.sound_data;
  const name = sound.attributes.name;
  const artistName = sound.attributes.artistName;
  const color = sound.attributes.artwork.bgColor;
  const artwork = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  // useMotionValueEvent breaks the tilt effect on re-renders so use onChange instead.
  // useEffect(() => {
  //   if (isExpanded) return;
  //
  //   const xControls = animate(x, [8, 8, -8, -8, 8], {
  //     repeat: Infinity,
  //     duration: 16,
  //     ease: "easeOut",
  //   });
  //
  //   const yControls = animate(y, [8, -8, -8, 8, 8], {
  //     repeat: Infinity,
  //     duration: 16,
  //     ease: "easeOut",
  //   });
  //
  //   const unsubscribeX = x.on("change", (latest) => {
  //     setTiltAngles((prev) => ({ ...prev, tiltAngleX: latest }));
  //   });
  //
  //   const unsubscribeY = y.on("change", (latest) => {
  //     setTiltAngles((prev) => ({ ...prev, tiltAngleY: latest }));
  //   });
  //
  //   return () => {
  //     xControls.stop();
  //     yControls.stop();
  //     unsubscribeX();
  //     unsubscribeY();
  //   };
  // }, [isExpanded, x, y]);

  // useEffect(() => {
  //   if (isExpanded) {
  //     setTiltAngles({ tiltAngleX: 0, tiltAngleY: 0 });
  //   }
  // }, [isExpanded]);

  return (
    <>
      <motion.div
        animate={{
          y: isExpanded ? -104 : 0,
          boxShadow: !isExpanded
            ? "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
            : "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`shadow-soundArt relative mt-[104px] rounded-full`}
      >
        <Tilt
          tiltAngleXManual={0}
          tiltAngleYManual={0}
          perspective={1000}
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          tiltReverse={true}
          reset={true}
          glareMaxOpacity={0.25}
          glareBorderRadius={"32px"}
          tiltEnable={true}
          transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
          className={`transform-style-3d cursor-pointer`}
        >
          <motion.div
            animate={{
              width: isExpanded ? 512 : 304,
              height: isExpanded ? 864 : 432,
              borderRadius: isExpanded
                ? "32px 32px 20px 20px"
                : "32px 32px 32px 32px",
            }}
            transition={{ type: "spring", damping: 70, stiffness: 600 }}
            className={`relative flex flex-col items-center overflow-hidden rounded-3xl bg-white`}
          >
            {/* Art */}
            <motion.div
              className={`origin-top`}
              animate={{
                y: isExpanded ? 66 : -24,
                scale: isExpanded ? 1.25 : 1,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <motion.div
                animate={{
                  borderRadius: isExpanded
                    ? "12px 12px 12px 12px"
                    : "32px 32px 0px 0px",
                }}
                className={`outline-silver overflow-hidden outline outline-1`}
              >
                <Image
                  src={artwork}
                  alt={`${name} by ${artistName} - artwork`}
                  quality={100}
                  width={304}
                  height={304}
                  draggable={false}
                />
              </motion.div>
            </motion.div>

            {/* Attribution */}
            {isExpanded ? (
              <>
                <div
                  className={`mb-[26px] mt-[calc(142px+32px)] w-[448px] mix-blend-darken`}
                >
                  <div
                    className={`bg-silver flex h-[52px] w-full items-center gap-2 rounded-2xl px-4 shadow-shadowKitLow flex-shrink-0`}
                  >
                    <div className={`opacity-50`}>
                      {getStarComponent(entry.rating)}
                    </div>

                    <div className={`text-gray2 flex flex-col`}>
                      <p className={`line-clamp-1 text-sm font-medium`}>
                        {artistName}
                      </p>
                      <p className={`line-clamp-1 text-base font-semibold`}>
                        {name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                {cmdk &&
                  createPortal(
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        transition={{
                          type: "spring",
                          damping: 40,
                          stiffness: 100,
                        }}
                        className={`absolute right-0 top-[527px] w-full -translate-x-full`}
                      >
                        <div
                          className={`absolute -right-5 flex items-center gap-2`}
                        >
                          <p
                            className={`text-gray2 line-clamp-1 text-base font-semibold`}
                          >
                            {entry.author.username}
                          </p>
                          <Avatar
                            className={`shadow-shadowKitHigh outline outline-4 outline-white`}
                            imageSrc={entry.author.image}
                            altText={`${entry.author.username}'s avatar`}
                            width={40}
                            height={40}
                            user={entry.author}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>,
                    cmdk,
                  )}
              </>
            ) : (
              <div
                className={`absolute center-x bottom-0 flex w-[304px] items-center justify-between bg-white px-6 pb-5`}
              >
                <div className={`flex items-center gap-2`}>
                  <div className={`flex-shrink-0 `}>
                    {getStarComponent(entry.rating)}
                  </div>

                  <div className={`flex flex-col`}>
                    <p
                      className={`text-gray2 line-clamp-1 text-sm font-medium`}
                    >
                      {artistName}
                    </p>
                    <p
                      className={`line-clamp-1 text-base font-semibold text-black`}
                    >
                      {name}
                    </p>
                  </div>
                </div>

                <Avatar
                  className={`border-silver border`}
                  imageSrc={entry.author.image}
                  altText={`${entry.author.username}'s avatar`}
                  width={32}
                  height={32}
                  user={entry.author}
                />
              </div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(1px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(1px)" }}
              key={isExpanded ? "expanded" : "collapsed"}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              {isExpanded ? (
                <p className={`m-8 mt-0 w-[448px] text-base origin-bottom`}>
                  {entry.text}
                </p>
              ) : (
                <p className={`m-6 -mt-[6px] line-clamp-3 w-[256px] text-base`}>
                  {entry.text}
                </p>
              )}
            </motion.div>
          </motion.div>
        </Tilt>
        {!isExpanded && <Interaction entry={entry} />}
      </motion.div>

      {/* If viewing a specific chain i.e. from notification */}
      {/*{chainId && (*/}
      {/*  <div className={`-ml-8 flex flex-col-reverse pr-8`}>*/}
      {/*    <p className={`text-sm`}>highlighted chain</p>*/}
      {/*    <Chain replyId={chainId} userId={user!.id} />*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Chains */}
      <div className={`min-h-full min-w-full px-8 pb-96 pt-8`}>
        <Replies entryId={entry.id} userId={user!.id} />
      </div>
    </>
  );
};

export default Entry;

// Handler function to update tilt angles
// const onMove = ({ tiltAngleX, tiltAngleY }: OnMoveParams) => {
//   console.log("x", tiltAngleX, "y", tiltAngleY);
// };

// {getStarComponent(artifactExtended.content!.rating!)}
