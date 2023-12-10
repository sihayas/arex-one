import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useSoundContext } from "@/context/SoundContext";

import { useAlbumQuery } from "@/lib/apiHelper/album";
import RenderArtifacts from "./sub/RenderArtifacts";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Filter from "@/components/interface/album/sub/Filter";

import { AlbumData, TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

import Statline from "@/components/interface/album/sub/Dial";
import { createPortal } from "react-dom";

const springConfig = { damping: 22, stiffness: 180 };
const scaleArtConfig = { damping: 20, stiffness: 122 };
const xArtConfig = { damping: 20, stiffness: 160 };
const yArtConfig = { damping: 20, stiffness: 180 };

const Album = () => {
  const { selectedSound } = useSoundContext();
  const { scrollContainerRef } = useInterfaceContext();
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "highlights" | "positive" | "critical"
  >("newest");

  const handleActiveSongChange = (newActiveSong: TrackData | null) => {
    setActiveSong(newActiveSong);
  };

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const xArtKeyframes = useTransform(scrollY, [0, 1], [0, -54]);
  const xArt = useSpring(xArtKeyframes, xArtConfig);

  const yArtKeyframes = useTransform(scrollY, [0, 1], [0, -54]);
  const yArt = useSpring(yArtKeyframes, yArtConfig);

  const scaleArtKeyframes = useTransform(scrollY, [0, 1], [1, 0.1]);
  const scaleArt = useSpring(scaleArtKeyframes, scaleArtConfig);

  const xDialKeyframes = useTransform(scrollY, [0, 1], [-176, -32]);
  const xDial = useSpring(xDialKeyframes, springConfig);

  const yDialKeyframes = useTransform(scrollY, [0, 1], [-176, -32]);
  const yDial = useSpring(yDialKeyframes, springConfig);

  const scaleDialKeyframes = useTransform(scrollY, [0, 1], [1, 0.6]);
  const scaleDial = useSpring(scaleDialKeyframes, springConfig);

  const borderKeyframes = useTransform(scrollY, [0, 1], [32, 124]);
  const borderRadius = useSpring(borderKeyframes, {
    damping: 36,
    stiffness: 400,
  });

  // Initializes album. If the album doesn't have detailed data fetch it.
  const { isLoading } = useAlbumQuery();

  if (!selectedSound) return;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px] relative"
    >
      {createPortal(
        <motion.div
          style={{
            x: xArt,
            y: yArt,
            scale: scaleArt,
            borderRadius,
          }}
          className="absolute pointer-events-none overflow-hidden z-50 right-0 bottom-0 origin-bottom-right"
        >
          <Image
            src={selectedSound.artworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={512}
            height={512}
            quality={100}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </motion.div>,
        cmdk,
      )}

      {createPortal(
        <motion.div
          className={`absolute z-50 pointer-events-none right-0 bottom-0 flex items-center justify-center drop-shadow`}
          style={{
            x: xDial,
            y: yDial,
            scale: scaleDial,
            transformOrigin: "bottom right",
          }}
        >
          <Statline ratings={[4, 8900, 2445, 5000, 500]} />
        </motion.div>,
        cmdk,
      )}

      {/* Entries */}
      <RenderArtifacts
        sound={selectedSound.sound as AlbumData}
        sortOrder={sortOrder}
      />

      {/*<div className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 outline outline-silver outline-1 rounded-full">*/}
      {/*  <Sort onSortOrderChange={handleSortOrderChange} />*/}
      {/*</div>*/}

      <motion.div
        style={{
          backgroundColor: `#${selectedSound.sound.attributes.artwork.bgColor}`,
        }}
        className="absolute bottom-8 right-8 w-24 h-24 blur-2xl"
      ></motion.div>
    </motion.div>
  );
};

export default Album;
{
  /*<motion.div*/
}
{
  /*  id={`rating`}*/
}
{
  /*  className={`text-[64px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-baskerville`}*/
}
{
  /*  style={{ color: textColor }}*/
}
{
  /*>*/
}
{
  /*  3.7*/
}
{
  /*</motion.div>*/
}
