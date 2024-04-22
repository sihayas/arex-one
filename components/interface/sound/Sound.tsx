import React, { useState } from "react";
import Image from "next/image";

import Entries from "./render/Entries";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { AlbumData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/Interface";

import Dial from "@/components/interface/sound/items/Dial";
import { createPortal } from "react-dom";
import Sort from "@/components/interface/sound/items/Sort";
import { useSoundInfoQuery } from "@/lib/helper/interface/sound";

const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };
const artConfig = { damping: 34, stiffness: 200 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [range, setRange] = useState<number | null>(null);
  const [ratings, setRatings] = useState<number[]>([]);

  const { scrollContainerRef, activePage, pages } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const xArt = useSpring(useTransform(scrollY, [0, 1], [0, 32]), xConfig);
  const yArt = useSpring(useTransform(scrollY, [0, 1], [0, 32]), yConfig);
  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.375]),
    artConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [32, 40]),
    generalConfig,
  );
  const xDial = useSpring(useTransform(scrollY, [0, 1], [-32, 0]), xConfig);
  const yDial = useSpring(useTransform(scrollY, [0, 1], [16, 0]), yConfig);
  const showMetaData = useSpring(
    useTransform(scrollY, [0, 1], [0, 1]),
    generalConfig,
  );

  const soundData = activePage.data as AlbumData;
  const { data } = useSoundInfoQuery(soundData.id);

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };
  const handleRangeChange = (newRange: number | null) => {
    setRange(newRange);
  };

  if (!data) return null;

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const artwork = MusicKit.formatArtworkURL(
    soundData.attributes.artwork,
    800,
    800,
  );
  const snapArt = activePage.isOpen ? "" : "snap-start";

  return (
    <>
      {/* Ghost Div Art PlaceHolder*/}
      <div className={`min-w-[496px] min-h-[496px] z-10 ${snapArt}`} />

      {/* Art */}
      <motion.div
        style={{
          borderRadius: borderRad,
          scale: scaleArt,
          x: xArt,
          y: yArt,
        }}
        className="shadow-soundArt flex-shrink-0 absolute top-0 left-0 pointer-events-none origin-top-left overflow-x-hidden"
      >
        <Image
          src={artwork}
          alt={`${soundData.attributes.name}'s artwork`}
          width={496}
          height={496}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      </motion.div>

      {/* Add Snap-Start here*/}
      <div className={`min-h-max w-full max-w-full snap-start`}>
        <Entries soundId={soundData.id} sortOrder={sortOrder} range={range} />
      </div>

      {/* Titles */}
      <motion.div
        style={{ opacity: showMetaData }}
        className={`text-gray2 absolute left-8 top-[calc(218px+35px)] -z-10 flex max-w-[288px] flex-col`}
      >
        <p className={`text-gray2 text-xl`}>
          {soundData.attributes.artistName}
        </p>
        <p className={`text-2xl font-bold`}>{soundData.attributes.name}</p>
      </motion.div>

      {/* Sort */}
      <div className={`absolute bottom-[176px] left-[176px]`}>
        {/*<Sort onSortOrderChange={handleSortOrderChange} />*/}
      </div>

      {/* Dial */}
      {cmdk &&
        createPortal(
          <motion.div
            className={`absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center will-change-transform drop-shadow-xl`}
            style={{ x: xDial, y: yDial }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
          >
            <Dial
              ratings={ratings || [1, 0, 0, 0, 0]}
              onRangeChange={handleRangeChange}
              average={data.avg_rating}
            />
          </motion.div>,
          cmdk,
        )}
    </>
  );
};

export default Sound;
