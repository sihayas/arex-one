import React, { useEffect, useMemo } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useSound } from "@/hooks/usePage";
import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/artifact/render/Replies";
import Chain from "@/components/interface/artifact/render/Chain";
import { ArtifactExtended } from "@/types/globalTypes";

import { getStarComponent } from "@/components/index/items/Entry";
import { AlbumData, SongData } from "@/types/appleTypes";
import Image from "next/image";

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
  const artifactType = artifactExtended.type;

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

  // Scroll to top on mount
  useEffect(() => {
    if (!activePage.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, []);

  return artifactType === "entry" ? (
    <>
      <Image
        className="shadow-shadowKitHigh border-silver mt-8 min-h-[304px] min-w-[304px] cursor-pointer rounded-[18px] border"
        onClick={handleSoundClick}
        src={artwork}
        alt={`${appleData.attributes.name} by ${appleData.attributes.artistName} - artwork`}
        quality={100}
        width={304}
        height={304}
        draggable={false}
      />

      {/* Attribution and Rating */}
      <div
        className={`relative flex w-full items-center gap-4 p-8 pb-[10px] pt-12`}
      >
        <Avatar
          className={`border-silver border`}
          imageSrc={artifactExtended.author.image}
          altText={`${artifactExtended.author.username}'s avatar`}
          width={48}
          height={48}
          user={artifactExtended.author}
        />
        <p className="font-semibold text-black">
          {artifactExtended.author.username}
        </p>

        <div className="absolute left-16 top-8 flex items-center gap-2">
          <div className="rounded-max z-10 bg-white p-2 outline outline-4 outline-[#F6F6F6]">
            {getStarComponent(artifactExtended.content!.rating!)}
          </div>
          <p className={`line-clamp-1 text-sm text-black`}>
            {appleData.attributes.name}
          </p>
          <p className={`text-gray2 line-clamp-1 text-sm`}>
            {appleData.attributes.artistName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={`text-gray p-8 pt-0 text-base font-medium`}>
        {artifactExtended.content?.text}
      </div>

      {/* If viewing a specific chain i.e. from notification */}
      {chainId && (
        <div className={`-ml-8 flex flex-col-reverse pr-8`}>
          <p className={`text-sm`}>highlighted chain</p>
          {/* <Chain replyId={chainId} userId={user!.id} /> */}
        </div>
      )}

      {/* Chains */}
      <div className={`min-h-full min-w-full px-8 pb-96`}>
        {/* <Replies artifactId={artifactExtended.id} userId={user!.id} /> */}
      </div>
    </>
  ) : (
    <>
      <Image
        className="shadow-shadowKitHigh m-8 mb-0 ml-auto min-h-[128px] min-w-[128px] rounded-[18px]"
        onClick={handleSoundClick}
        src={artwork}
        alt={`${appleData.attributes.name} by ${appleData.attributes.artistName} - artwork`}
        quality={100}
        width={128}
        height={128}
        draggable={false}
      />

      <div className="flex w-full flex-col items-end p-8 pb-[18px] pt-2.5">
        <p className={`text-gray2 line-clamp-1 text-end text-sm`}>
          {appleData.attributes.artistName}
        </p>

        <p
          className={`text-gray2 line-clamp-1 text-end text-base font-semibold`}
        >
          {appleData.attributes.name}
        </p>
      </div>

      <div className="cloud-shadow flex items-end gap-2 px-8 pb-8">
        <Avatar
          className={`border-silver border`}
          imageSrc={artifactExtended.author.image}
          altText={`${artifactExtended.author.username}'s avatar`}
          width={48}
          height={48}
          user={artifactExtended.author}
        />

        <motion.div
          className={`relative mb-3 w-fit overflow-visible rounded-[18px] bg-white px-3 py-1.5`}
        >
          {/* Content  */}
          <div className="`text-base line-clamp-[7] text-black">
            {artifactExtended.content?.text}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
            />
            <div
              className={`absolute bottom-0 left-0 h-1 w-1 rounded-full bg-white`}
            />
          </div>
        </motion.div>
      </div>

      {/* If viewing a specific chain i.e. from notification */}
      {chainId && (
        <div className={`-ml-8 flex flex-col-reverse pr-8`}>
          <p className={`text-sm`}>highlighted chain</p>
          {/* <Chain replyId={chainId} userId={user!.id} /> */}
        </div>
      )}

      {/* Chains */}
      <div className={`min-h-full min-w-full px-8 pb-96`}>
        {/* <Replies artifactId={artifactExtended.id} userId={user!.id} /> */}
      </div>
    </>
  );
};

export default Artifact;
