import React, { useEffect, useState } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import {
  animate,
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

export const Artifact = () => {
  const { activePage, scrollContainerRef, pages } = useInterfaceContext();
  const { handleSelectSound } = useSound();

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

  const x = useSpring(0, { damping: 560, stiffness: 80 });
  const y = useSpring(0, { damping: 560, stiffness: 80 });

  // useMotionValueEvent breaks the tilt effect on re-renders so use onChange instead.
  useEffect(() => {
    const xControls = animate(x, [16, 16, -16, -16, 16], {
      repeat: Infinity,
      duration: 12,
      ease: "easeOut",
    });

    const yControls = animate(y, [16, -16, -16, 16, 16], {
      repeat: Infinity,
      duration: 12,
      ease: "easeOut",
    });

    const unsubscribeX = x.on("change", (latest) => {
      setTiltAngles((prev) => ({ ...prev, tiltAngleX: latest }));
    });

    const unsubscribeY = y.on("change", (latest) => {
      setTiltAngles((prev) => ({ ...prev, tiltAngleY: latest }));
    });

    return () => {
      xControls.stop();
      yControls.stop();

      unsubscribeX();
      unsubscribeY();
    };
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    if (!activePage.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Tilt
        tiltAngleXManual={tiltAngles.tiltAngleX}
        tiltAngleYManual={tiltAngles.tiltAngleY}
        perspective={1000}
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        tiltReverse={true}
        reset={true}
        glareEnable={true}
        glareMaxOpacity={0.45}
        glareBorderRadius={"32px"}
        transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
        className={`transform-style-3d shadow-artifact relative mt-10 h-[454px] w-[432px] cursor-pointer rounded-[32px]`}
      >
        <div
          className={`relative h-[454px] w-[432px] overflow-hidden rounded-[24px] bg-white p-4`}
        >
          <Image
            className="border-silver cursor-pointer rounded-xl border"
            onClick={handleSoundClick}
            src={artwork}
            alt={`${appleData.attributes.name} by ${appleData.attributes.artistName} - artwork`}
            quality={100}
            width={208}
            height={208}
            draggable={false}
          />

          {/* Rating */}
          <div className="mt-[14px] flex items-center gap-4">
            {getStarComponent(artifactExtended.content!.rating!)}

            <div className={`flex flex-col`}>
              <p className={`line-clamp-1 text-sm text-black`}>
                {appleData.attributes.artistName}
              </p>
              <p className={`line-clamp-1 text-base font-semibold text-black`}>
                {appleData.attributes.name}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={`mt-[6px] text-base`}>
            {artifactExtended.content?.text}
          </div>

          <div
            style={{
              backgroundImage:
                "linear-gradient(to top, rgb(255, 255, 255) 56.72%, transparent)",
            }}
            className="absolute bottom-0 left-0 flex h-[86px] w-full items-end p-4"
          >
            <div className={`flex items-center gap-2`}>
              <Avatar
                className={`border-silver border`}
                imageSrc={artifactExtended.author.image}
                altText={`${artifactExtended.author.username}'s avatar`}
                width={32}
                height={32}
                user={artifactExtended.author}
              />
              <p className={`line-clamp-1 text-base font-medium text-black`}>
                {artifactExtended.author.username}
              </p>
            </div>
          </div>
        </div>
      </Tilt>
    </>
  );
};

export default Artifact;

// Handler function to update tilt angles
// const onMove = ({ tiltAngleX, tiltAngleY }: OnMoveParams) => {
//   console.log("x", tiltAngleX, "y", tiltAngleY);
// };
