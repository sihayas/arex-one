import React, { useState } from "react";
import Image from "next/image";

import { useSoundContext } from "@/context/SoundContext";

import RenderArtifacts from "./sub/RenderArtifacts";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { SongData } from "@/types/appleTypes";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";

import Dial from "@/components/interface/album/sub/Dial";
import { createPortal } from "react-dom";
import { GetDimensions } from "@/components/interface/Interface";
// import Dial from "@/components/global/RatingDial";

const springConfig = { damping: 28, stiffness: 180 };
const scaleArtConfig = { damping: 20, stiffness: 122 };
const xArtConfig = { damping: 20, stiffness: 160 };
const yArtConfig = { damping: 20, stiffness: 100 };

const Album = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedSound } = useSoundContext();
  const { scrollContainerRef, activePage } = useInterfaceContext();

  const activePageName: PageName = activePage.name as PageName;

  const { base, target } = GetDimensions(activePageName);

  const [sortOrder, setSortOrder] = useState<
    "newest" | "highlights" | "positive" | "critical"
  >("newest");

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const ALIGN_WITH_WINDOW = target.height - 432;

  const xArtKeyframes = useTransform(scrollY, [0, 1], [0, 16]);
  const yArtKeyframes = useTransform(
    scrollY,
    [0, 1],
    [-ALIGN_WITH_WINDOW, -16],
  );
  const scaleArtKeyframes = useTransform(scrollY, [0, 1], [1, 0.1389]);

  const xDialKeyframes = useTransform(scrollY, [0, 1], [0, 0]);
  const yDialKeyframes = useTransform(
    scrollY,
    [0, 1],
    [-ALIGN_WITH_WINDOW - 0, 0],
  );
  const scaleDialKeyframes = useTransform(scrollY, [0, 1], [1, 0.5]);
  const borderKeyframes = useTransform(scrollY, [0, 1], [32, 96]);

  const yArt = useSpring(yArtKeyframes, yArtConfig);
  const xArt = useSpring(xArtKeyframes, xArtConfig);
  const scaleArt = useSpring(scaleArtKeyframes, scaleArtConfig);

  const xDial = useSpring(xDialKeyframes, xArtConfig);
  const yDial = useSpring(yDialKeyframes, yArtConfig);
  const scaleDial = useSpring(scaleDialKeyframes, scaleArtConfig);
  const borderRadius = useSpring(borderKeyframes, {
    damping: 36,
    stiffness: 400,
  });

  if (!selectedSound) return;

  let albumId;
  const artwork = selectedSound.attributes.artwork.url
    .replace("{w}", "800")
    .replace("{h}", "800");
  const name = selectedSound.attributes.name;
  const artist = selectedSound.attributes.artistName;

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
      className="w-full min-h-full mt-[1px] relative"
    >
      <RenderArtifacts
        soundId={albumId}
        sortOrder={sortOrder}
        isOpen={isOpen}
      />

      {/* Art */}
      <motion.div
        style={{
          borderRadius,
          scale: scaleArt,
          y: yArt,
          x: xArt,
        }}
        className="absolute overflow-hidden z-40 left-0 bottom-0 origin-bottom-left shadow-miniCard"
      >
        <Image
          src={artwork}
          alt={`${name}'s artwork`}
          width={432}
          height={432}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      </motion.div>

      {/* Dial */}
      <motion.div
        className={`absolute z-50 right-0 bottom-0 flex items-center justify-center origin-bottom-right p-2`}
        style={{
          x: xDial,
          y: yDial,
          scale: scaleDial,
        }}
      >
        <Dial ratings={[4, 8900, 2445, 5000000, 500]} />
      </motion.div>

      {/* Titles */}
      <motion.div
        className={`absolute z-5 center-x bottom-4 rounded-2xl p-4 flex flex-col gap-2 bg-white items-center justify-center origin-bottom shadow-shadowKitHigh`}
      >
        <p className={`text-black font-bold text-base leading-[11px]`}>
          {name}
        </p>
        <p className={`text-gray2 font-medium text-sm leading-[9px]`}>
          {artist}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Album;
