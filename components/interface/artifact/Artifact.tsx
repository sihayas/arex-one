import React, { useEffect, useState } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useSound } from "@/hooks/usePage";
import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/artifact/render/Replies";
import Chain from "@/components/interface/artifact/render/Chain";
import { ArtifactExtended } from "@/types/globalTypes";

import { getStarComponent } from "@/components/index/items/Entry";
import { AlbumData, SongData } from "@/types/appleTypes";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { StarIcon } from "@/components/icons";
import { Interaction } from "@/components/global/Interaction";
import { createPortal } from "react-dom";
import Dial from "@/components/interface/sound/sub/Dial";
import DialMini from "@/components/interface/sound/sub/DialMini";

export const Artifact = () => {
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const { activePage, scrollContainerRef, pages, user } = useInterfaceContext();
  const { handleSelectSound } = useSound();
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const artifactExtended = activePage.artifact?.data as ArtifactExtended;
  // If opening from a notification, load the chain
  const chainId = activePage.artifact?.replyTo;

  const album = artifactExtended.sound.appleData as AlbumData;
  const song = artifactExtended.sound.appleData as SongData;
  const appleData = album ? album : song;

  const color = appleData.attributes.artwork.bgColor;
  const artwork = MusicKit.formatArtworkURL(
    appleData.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  const handleSoundClick = () => {
    handleSelectSound(artifactExtended.sound.appleData);
  };

  const [tiltAngles, setTiltAngles] = useState({
    tiltAngleX: 0,
    tiltAngleY: 0,
  });

  const x = useSpring(0, { damping: 320, stiffness: 80 });
  const y = useSpring(0, { damping: 320, stiffness: 80 });

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

  // Scroll to top on mount
  useEffect(() => {
    if (!activePage.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <motion.div
        animate={{
          y: isExpanded ? -104 : 0,
          boxShadow: !isExpanded
            ? "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
            : "rgba(255, 255, 255, 0.0) 0px 1px 1px 0px inset, rgba(50," +
              " 50,93, 0.0) 0px 50px 100px -20px, rgba(0, 0, 0, 0.0) 0px 30px 60px -30px",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative mt-[104px] shadow-soundArt rounded-full`}
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
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className={`flex flex-col bg-white items-center overflow-hidden rounded-3xl relative`}
          >
            {/* Art */}
            <motion.div
              className={`origin-top`}
              animate={{
                y: isExpanded ? 66 : -24,
                scale: isExpanded ? 1.25 : 1,
              }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <motion.div
                animate={{
                  borderRadius: isExpanded
                    ? "12px 12px 12px 12px"
                    : "32px 32px 0px 0px",
                  boxShadow: isExpanded
                    ? `#${color}1A 0px 1px 1px 0px inset, #${color}40 0px 50px 100px -20px, #${color}4D 0px 30px 60px -30px`
                    : `#${color}00 0px 1px 1px 0px inset, #${color}00 0px 50px 100px -20px, #${color}00 0px 30px 60px -30px`,
                }}
                className={`overflow-hidden outline outline-1 outline-silver`}
              >
                <Image
                  src={artwork}
                  alt={`${appleData.attributes.name} by ${appleData.attributes.artistName} - artwork`}
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
                  className={`w-[448px] mt-[calc(142px+32px)] mb-[26px] mix-blend-darken`}
                >
                  <div
                    className={`w-full bg-silver shadow-inset flex items-center px-4 h-[52px] rounded-2xl gap-2`}
                  >
                    <StarIcon color={"#999"} />
                    <div className={`flex flex-col text-gray2`}>
                      <p className={`line-clamp-1 text-sm font-medium`}>
                        {appleData.attributes.artistName}
                      </p>
                      <p className={`line-clamp-1 text-base font-semibold`}>
                        {appleData.attributes.name}
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
                        className={`absolute top-[527px] right-0 w-full -translate-x-full`}
                      >
                        <div
                          className={`absolute -right-5 flex items-center gap-2`}
                        >
                          <p
                            className={`line-clamp-1 text-base font-semibold text-gray2`}
                          >
                            {artifactExtended.author.username}
                          </p>
                          <Avatar
                            className={`outline outline-4 outline-white shadow-shadowKitHigh`}
                            imageSrc={artifactExtended.author.image}
                            altText={`${artifactExtended.author.username}'s avatar`}
                            width={40}
                            height={40}
                            user={artifactExtended.author}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>,
                    cmdk,
                  )}
              </>
            ) : (
              <div
                className={`flex items-center justify-between absolute bottom-0 left-0 bg-white w-full pb-5 px-6`}
              >
                <div className={`flex items-center gap-2`}>
                  <StarIcon color={`#000`} />
                  <div className={`flex flex-col`}>
                    <p
                      className={`text-gray2 line-clamp-1 text-sm font-medium`}
                    >
                      {appleData.attributes.artistName}
                    </p>
                    <p
                      className={`line-clamp-1 text-base font-semibold text-black`}
                    >
                      {appleData.attributes.name}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 flex-shrink-0`}>
                  <p
                    className={`line-clamp-1 text-base font-semibold text-gray2`}
                  >
                    {artifactExtended.author.username}
                  </p>

                  <Avatar
                    className={`border-silver border`}
                    imageSrc={artifactExtended.author.image}
                    altText={`${artifactExtended.author.username}'s avatar`}
                    width={32}
                    height={32}
                    user={artifactExtended.author}
                  />
                </div>
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
                <p className={`w-[448px] text-base m-8 mt-0`}>
                  {artifactExtended.content?.text}
                </p>
              ) : (
                <p
                  className={`w-[256px] text-base line-clamp-3 m-6 mt-0 -mt-[6px]`}
                >
                  {artifactExtended.content?.text}
                </p>
              )}
            </motion.div>
          </motion.div>
        </Tilt>
        {!isExpanded && <Interaction artifact={artifactExtended} />}
      </motion.div>

      {/* If viewing a specific chain i.e. from notification */}
      {chainId && (
        <div className={`-ml-8 flex flex-col-reverse pr-8`}>
          <p className={`text-sm`}>highlighted chain</p>
          <Chain replyId={chainId} userId={user!.id} />
        </div>
      )}

      {/* Chains */}
      <div className={`min-h-full min-w-full px-8  pb-96 pt-8`}>
        <Replies artifactId={artifactExtended.id} userId={user!.id} />
      </div>
    </>
  );
};

export default Artifact;

// Handler function to update tilt angles
// const onMove = ({ tiltAngleX, tiltAngleY }: OnMoveParams) => {
//   console.log("x", tiltAngleX, "y", tiltAngleY);
// };

// {getStarComponent(artifactExtended.content!.rating!)}
