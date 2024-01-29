import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Page,
  PageName,
  useInterfaceContext,
} from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useSound } from "@/hooks/usePage";
import useHandleHeartClick from "@/hooks/useHeart";
import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/artifact/render/Replies";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";

import Heart from "@/components/global/Heart";

import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";

const artworkConfig = {
  type: "spring",
  stiffness: 357,
  damping: 60,
  mass: 2,
};

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

  const artifactExtended = useMemo(
    () => activePage.artifact as ArtifactExtended,
    [activePage],
  );

  const sound = artifactExtended.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 520, 520);

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  const artifact = artifactExtended;

  // Scroll to top on mount
  useEffect(() => {
    if (!activePage.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <motion.div
        className={`flex items-end pt-8 gap-12 rotate-3`}
        transition={artworkConfig}
      >
        <div className={`-rotate-6`}>
          <EntryDial rating={artifact.content!.rating!} />
        </div>
        <Image
          className={`cursor-pointer rounded-3xl border border-silver -z-10`}
          onClick={handleSoundClick}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={304}
          height={304}
        />
      </motion.div>

      <div
        className={`-mt-8 flex flex-col gap-[18px] bg-white shadow-shadowKitHigh p-6 mx-8 outline outline-silver outline-1 rounded-3xl z-10`}
      >
        <div
          className={`flex w-full items-center justify-between max-h-[32px]`}
        >
          <div className={`flex flex-col`}>
            <p className={`text-gray2 line-clamp-1 text-sm`}>
              {sound.attributes.artistName}
            </p>
            <p className={`text-black line-clamp-1 text-base font-semibold`}>
              {sound.attributes.name}
            </p>
          </div>

          <div className={`flex w-max items-center gap-2`}>
            <p className={`text-base font-medium text-end`}>
              {artifact.author.username}
            </p>
            <Avatar
              className={`border-silver border`}
              imageSrc={artifact.author.image}
              altText={`${artifact.author.username}'s avatar`}
              width={32}
              height={32}
              user={artifact.author}
            />
          </div>
        </div>
        <div className={`text-base text-black`}>{artifact.content?.text}</div>
      </div>

      <div className={`min-w-full min-h-full`}></div>
    </>
  );
};

export default Artifact;

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//   artifactExtended.heartedByUser,
//   artifactExtended._count.hearts,
//   "/api/heart/post/artifact",
//   "artifactId",
//   artifactExtended.id,
//   artifactExtended.authorId,
//   user?.id,
// );
