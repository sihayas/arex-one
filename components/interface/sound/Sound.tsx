import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useSoundContext } from "@/context/SoundContext";

import Artifacts from "./render/Artifacts";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { SongData } from "@/types/appleTypes";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";

import Dial from "@/components/interface/sound/sub/Dial";
import DialMini from "@/components/interface/sound/sub/DialMini";
import { createPortal } from "react-dom";
import { GetDimensions } from "@/components/interface/Interface";
import Sort from "@/components/interface/sound/sub/Sort";

const scaleConfig = { damping: 20, stiffness: 122 };
const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const { scrollContainerRef, activePage, pages, setActivePage } =
    useInterfaceContext();
  const { selectedSound } = useSoundContext();

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [range, setRange] = useState<number | null>(null);

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleRangeChange = (newRange: number | null) => {
    setRange(newRange);
  };

  // Art Transformations
  const yArt = useSpring(useTransform(scrollY, [0, 1], [0, -16]), yConfig);
  const xArt = useSpring(useTransform(scrollY, [0, 1], [0, 16]), xConfig);
  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.1389]),
    scaleConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [32, 96]),
    generalConfig,
  );

  // Dial Transformations
  const xDial = useSpring(useTransform(scrollY, [0, 1], [48, -16]), xConfig);
  const yDial = useSpring(useTransform(scrollY, [0, 1], [48, -16]), yConfig);
  const scaleDial = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.25]),
    scaleConfig,
  );
  const hideDial = useSpring(
    useTransform(scrollY, [0, 1], [1, 0]),
    generalConfig,
  );

  // Mini Dial Transformations
  const showMini = useSpring(
    useTransform(scrollY, [0, 1], [0, 1]),
    generalConfig,
  );

  if (!selectedSound) return;

  const artwork = MusicKit.formatArtworkURL(
    selectedSound.attributes.artwork,
    800,
    800,
  );
  const name = selectedSound.attributes.name;
  const artist = selectedSound.attributes.artistName;

  const albumId =
    selectedSound.type === "albums"
      ? selectedSound.id
      : (selectedSound as SongData).relationships.albums.data[0].id;

  return (
    <>
      {/* Art Ghost Placaeholder */}

      <div className={`min-w-[432px] min-h-[432px] snap-start`} />
      <div className={`mt-1`}>
        <Artifacts soundId={albumId} sortOrder={sortOrder} range={range} />
      </div>
      {/* Art */}
      <motion.div
        style={{
          borderRadius: borderRad,
          scale: scaleArt,
          y: yArt,
          x: xArt,
        }}
        className="absolute overflow-hidden z-40 left-0 bottom-0 origin-bottom-left shadow-miniCard pointer-events-none"
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

      {/* Titles */}
      <motion.div
        className={`absolute center-x bottom-4 rounded-2xl p-4 flex flex-col gap-2 bg-white items-center justify-center origin-bottom shadow-shadowKitHigh`}
      >
        <p className={`text-black font-bold text-base leading-[11px]`}>
          {name}
        </p>
        <p
          className={`text-gray2 font-medium text-sm leading-[9px] line-clamp-1`}
        >
          {artist}
        </p>
      </motion.div>

      {/* Sort */}
      <div className={`absolute bottom-8 right-[92px]`}>
        <Sort onSortOrderChange={handleSortOrderChange} />
      </div>

      {/* Dial */}
      {cmdk &&
        createPortal(
          <>
            {/* Big Dial */}
            <motion.div
              className={`absolute right-0 bottom-0 flex items-center justify-center origin-bottom-right will-change-transform drop-shadow-xl`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: hideDial,
              }}
            >
              <Dial ratings={[4, 8900, 2445, 500, 500]} average={3.8} />
            </motion.div>

            {/* Mini Dial */}
            <motion.div
              className={`absolute right-0 bottom-0 flex items-center justify-center origin-bottom-right will-change-transform`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: showMini,
              }}
            >
              <DialMini
                ratings={[4, 8900, 2445, 500, 500]}
                onRangeChange={handleRangeChange}
              />
            </motion.div>
          </>,
          cmdk,
        )}
    </>
  );
};

export default Sound;
