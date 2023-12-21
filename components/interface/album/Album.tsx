import React, { useState } from "react";
import Image from "next/image";

import { useSoundContext } from "@/context/SoundContext";

import RenderArtifacts from "./sub/RenderArtifacts";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

import Statline from "@/components/interface/album/sub/Dial";

const springConfig = { damping: 28, stiffness: 180 };
const scaleArtConfig = { damping: 20, stiffness: 122 };
const xArtConfig = { damping: 20, stiffness: 160 };
const yArtConfig = { damping: 20, stiffness: 180 };

const Y_ART_BASELINE = 230;
const Y_ART_PADDING = 16;
const Y_ART_DIAL_OFFSET = 16;

const X_ART_BASELINE = 234;
const X_ART_PADDING = 16;
const X_ART_DIAL_OFFSET = 18;

const Album = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedSound } = useSoundContext();
  const { scrollContainerRef } = useInterfaceContext();

  const [sortOrder, setSortOrder] = useState<
    "newest" | "highlights" | "positive" | "critical"
  >("newest");

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const xArtOffset = X_ART_BASELINE - X_ART_PADDING - X_ART_DIAL_OFFSET;
  const xArtKeyframes = useTransform(scrollY, [0, 1], [0, xArtOffset]);
  const xArt = useSpring(xArtKeyframes, xArtConfig);

  // 230 to align with top of container 184
  const yArtOffset = Y_ART_BASELINE - Y_ART_PADDING - Y_ART_DIAL_OFFSET;
  const yArtKeyframes = useTransform(scrollY, [0, 1], [0, -yArtOffset]);
  const yArt = useSpring(yArtKeyframes, yArtConfig);

  const scaleArtKeyframes = useTransform(scrollY, [0, 1], [1, 0.0833]);
  const scaleArt = useSpring(scaleArtKeyframes, scaleArtConfig);

  const xDialKeyframes = useTransform(scrollY, [0, 1], [-208, -16]);
  const xDial = useSpring(xDialKeyframes, springConfig);

  const yDialKeyframes = useTransform(scrollY, [0, 1], [208, -64]);
  const yDial = useSpring(yDialKeyframes, springConfig);

  const scaleDialKeyframes = useTransform(scrollY, [0, 1], [1, 0.5]);
  const scaleDial = useSpring(scaleDialKeyframes, springConfig);

  const borderKeyframes = useTransform(scrollY, [0, 1], [32, 124]);
  const borderRadius = useSpring(borderKeyframes, {
    damping: 36,
    stiffness: 400,
  });

  if (!selectedSound) return;

  let albumId;
  const artwork = selectedSound.attributes.artwork.url
    .replace("{w}", "1200")
    .replace("{h}", "1200");
  const name = selectedSound.attributes.name;

  if (selectedSound.type === "albums") {
    albumId = selectedSound.id;
  } else {
    const song = selectedSound as SongData;
    albumId = song.relationships.albums.data[0].id;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px]"
    >
      <motion.div
        style={{
          x: xArt,
          y: yArt,
          scale: scaleArt,
          borderRadius,
        }}
        className="absolute pointer-events-none overflow-hidden z-50 right-0 top-0 shadow-shadowKitHigh"
      >
        <Image
          src={artwork}
          alt={`${name}'s artwork`}
          width={576}
          height={576}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      </motion.div>
      <motion.div
        className={`absolute z-50 pointer-events-none right-0 top-0 flex items-center justify-center drop-shadow`}
        style={{
          x: xDial,
          y: yDial,
          scale: scaleDial,
          transformOrigin: "bottom right",
        }}
      >
        <Statline ratings={[4, 8900, 2445, 5000000, 500]} />
      </motion.div>
      ,{/* Entries */}
      <RenderArtifacts
        soundId={albumId}
        sortOrder={sortOrder}
        isOpen={isOpen}
      />
      {/*<div className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 outline outline-silver outline-1 rounded-full">*/}
      {/*  <Sort onSortOrderChange={handleSortOrderChange} />*/}
      {/*</div>*/}
    </motion.div>
  );
};

export default Album;
