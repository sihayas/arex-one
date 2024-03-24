import React, { useEffect, useState } from "react";
import Image from "next/image";

import Artifacts from "./render/Artifacts";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { AlbumData, SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/Interface";

import Dial from "@/components/interface/sound/sub/Dial";
import { createPortal } from "react-dom";
import Sort from "@/components/interface/sound/sub/Sort";
import { useSoundInfoQuery } from "../../../lib/helper/interface/sound";

const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };
const artConfig = { damping: 34, stiffness: 200 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const { scrollContainerRef, activePage, pages } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const isOpen = activePage.isOpen;

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [range, setRange] = useState<number | null>(null);
  const [soundData, setSoundData] = useState<AlbumData | SongData | null>(null);

  const [ratings, setRatings] = useState<number[]>([]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };
  const handleRangeChange = (newRange: number | null) => {
    setRange(newRange);
  };

  // Art
  const xArt = useSpring(useTransform(scrollY, [0, 1], [0, -64]), xConfig);
  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.375]),
    artConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [32, 40]),
    generalConfig,
  );

  // Dial
  const xDial = useSpring(useTransform(scrollY, [0, 1], [0, 32]), xConfig);
  const yDial = useSpring(useTransform(scrollY, [0, 1], [-16, -32]), yConfig);

  const showMetaData = useSpring(
    useTransform(scrollY, [0, 1], [0, 1]),
    generalConfig,
  );

  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activePage.sound) {
      setSoundData(activePage.sound.data);
    }
  }, [activePage]);

  const { data } = useSoundInfoQuery(soundData?.id);

  useEffect(() => {
    if (data) {
      setRatings(Object.values(data.ratings).map(Number));
    }
  }, [data]);

  if (!soundData || !data) return null;

  const artwork = MusicKit.formatArtworkURL(
    soundData.attributes.artwork,
    800,
    800,
  );

  const appleAlbumId =
    soundData.type === "albums"
      ? soundData.id
      : (soundData as SongData).relationships.albums.data[0].id;

  console.log(data);

  return (
    <>
      {/* Art */}
      <motion.div
        style={{
          borderRadius: borderRad,
          scale: scaleArt,
          x: xArt,
        }}
        className="shadow-soundArt flex-shrink-0 origin-top-left overflow-hidden sticky top-0"
      >
        <Image
          src={artwork}
          alt={`${soundData.attributes.name}'s artwork`}
          width={496}
          height={497}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      </motion.div>

      <div className={`min-h-max w-full`}>
        <Artifacts soundId={appleAlbumId} sortOrder={sortOrder} range={range} />
      </div>

      {/* Titles */}
      <motion.div
        style={{
          opacity: showMetaData,
        }}
        className={`text-gray2 absolute left-8 top-[222px] -z-10 flex max-w-[288px] flex-col`}
      >
        <p className={`text-gray2 text-[18px] font-medium`}>
          {soundData.attributes.artistName}
        </p>
        <p className={`text-[26px] font-bold`}>{soundData.attributes.name}</p>
      </motion.div>

      {/* Sort */}
      <div className={`absolute bottom-[176px] left-[176px]`}>
        <Sort onSortOrderChange={handleSortOrderChange} />
      </div>

      {/* Dial */}
      {cmdk &&
        createPortal(
          <motion.div
            className={`absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center will-change-transform drop-shadow-xl`}
            style={{ x: xDial, y: yDial }}
            initial={{ x: !isOpen ? 0 : -96 }}
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
