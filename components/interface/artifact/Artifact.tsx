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
import { getStarComponent } from "@/components/index/items/Entry";

const artworkConfig = {
  type: "spring",
  stiffness: 357,
  damping: 60,
  mass: 2,
};

export const Artifact = () => {
  const { activePage, scrollContainerRef, pages, user } = useInterfaceContext();
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

  if (!user) return;

  return (
    <>
      <motion.div
        className={`z-10 mr-auto flex -rotate-3 items-end gap-12 px-16 pt-8`}
        transition={artworkConfig}
      >
        <Image
          className={`border-silver -z-10 cursor-pointer rounded-3xl border`}
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
        className={`shadow-shadowKitHigh outline-silver z-10 mx-8 -mt-8 flex flex-col gap-[18px] rounded-3xl bg-white p-6 outline outline-1`}
      >
        <div className={`flex max-h-[32px] w-full items-center`}>
          <div className="rounded-max outline-silver bg-[#F4F4F4] p-3 outline outline-1">
            {getStarComponent(artifact.content!.rating!)}
          </div>

          <div className={`ml-4 flex flex-col`}>
            <p className={`text-gray2 line-clamp-1 text-sm`}>
              {sound.attributes.artistName}
            </p>
            <p className={`line-clamp-1 text-base font-semibold text-black`}>
              {sound.attributes.name}
            </p>
          </div>

          <div className={`ml-auto flex w-max items-center gap-2`}>
            <p className={`text-end text-base font-medium`}>
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

      <div className={`min-h-full min-w-full p-8`}>
        <Replies artifactId={artifact.id} userId={user.id} />
      </div>
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
