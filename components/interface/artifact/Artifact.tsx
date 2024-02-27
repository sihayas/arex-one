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

export const Artifact = () => {
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

  const artifactExtended = activePage.artifact?.artifact as ArtifactExtended;
  // If opening from a notification, load the chain
  const chainId = activePage.artifact?.replyTo;

  const album = artifactExtended.sound.appleData as AlbumData;
  const song = artifactExtended.sound.appleData as SongData;
  const appleData = album ? album : song;

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
  // }, [isExpanded]);
  //
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
          y: isExpanded ? -22 : 0,
        }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 100,
        }}
      >
        <Tilt
          tiltAngleXManual={tiltAngles.tiltAngleX}
          tiltAngleYManual={tiltAngles.tiltAngleY}
          perspective={1000}
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          tiltReverse={true}
          reset={true}
          glareMaxOpacity={0.25}
          glareBorderRadius={"32px"}
          tiltEnable={true}
          transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
          className={`transform-style-3d shadow-artifact relative mt-[56px] cursor-pointer overflow-hidden rounded-3xl`}
        >
          <motion.div
            animate={{
              width: isExpanded ? 448 : 400,
              height: isExpanded ? "auto" : 560,
            }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 220,
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex flex-col p-6 overflow-hidden bg-white rounded-3xl`}
          >
            <div className="flex justify-between">
              <StarIcon />

              <Image
                className="border-silver cursor-pointer rounded-xl shadow-shadowKitHigh"
                onClick={handleSoundClick}
                src={artwork}
                alt={`${appleData.attributes.name} by ${appleData.attributes.artistName} - artwork`}
                quality={100}
                width={304}
                height={304}
                draggable={false}
              />
            </div>

            {/* Names */}
            <div className={`flex flex-col pt-5 pb-[30px]`}>
              <p className={`line-clamp-1 text-sm text-gray2 font-medium`}>
                {appleData.attributes.artistName}
              </p>
              <p className={`line-clamp-4 text-base font-semibold text-black`}>
                {appleData.attributes.name}
              </p>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              key={isExpanded ? "expanded" : "collapsed"}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
              }}
            >
              {isExpanded ? (
                <p className={`text-base w-[400px]`}>
                  {artifactExtended.content?.text}
                </p>
              ) : (
                <p className={`text-base w-[352px]`}>
                  {artifactExtended.content?.text}
                </p>
              )}
            </motion.div>

            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75) 48.74%, rgb(255, 255, 255))",
              }}
              className="absolute bottom-0 left-0 flex h-[88px] w-full items-end p-6"
            >
              <div className={`flex items-center gap-2`}>
                <Avatar
                  className={`border-silver border`}
                  imageSrc={artifactExtended.author.image}
                  altText={`${artifactExtended.author.username}'s avatar`}
                  width={40}
                  height={40}
                  user={artifactExtended.author}
                />
                <p className={`line-clamp-1 text-base font-medium text-black`}>
                  {artifactExtended.author.username}
                </p>
              </div>
            </div>
          </motion.div>
        </Tilt>
      </motion.div>

      {/* If viewing a specific chain i.e. from notification */}
      {chainId && (
        <div className={`-ml-8 flex flex-col-reverse pr-8`}>
          <p className={`text-sm`}>highlighted chain</p>
          <Chain replyId={chainId} userId={user!.id} />
        </div>
      )}

      {/* Chains */}
      <div className={`min-h-full min-w-full pt-8  px-8 pb-96`}>
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
