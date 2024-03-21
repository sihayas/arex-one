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
import { useInterfaceContext } from "@/context/InterfaceContext";

import Dial from "@/components/interface/sound/sub/Dial";
import DialMini from "@/components/interface/sound/sub/DialMini";
import { createPortal } from "react-dom";
import Sort from "@/components/interface/sound/sub/Sort";
import { useSoundInfoQuery } from "@/lib/helper/sound";
import { ArtifactExtended } from "@/types/globalTypes";

const scaleConfig = { damping: 16, stiffness: 122 };
const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const { scrollContainerRef, activePage, pages } = useInterfaceContext();
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const isOpen = activePage.isOpen;

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [range, setRange] = useState<number | null>(null);
  const [soundData, setSoundData] = useState<AlbumData | SongData | null>(null);

  const [ratings, setRatings] = useState<number[]>([]);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
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

  const xArt = useSpring(useTransform(scrollY, [0, 1], [0, -96]), xConfig);
  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.375]),
    scaleConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [20, 40]),
    generalConfig,
  );

  const xDial = useSpring(useTransform(scrollY, [0, 1], [-72, 32]), xConfig);
  const yDial = useSpring(useTransform(scrollY, [0, 1], [72, -32]), yConfig);
  const scaleDial = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.25]),
    scaleConfig,
  );
  const hideDial = useSpring(
    useTransform(scrollY, [0, 1], [1, 0]),
    generalConfig,
  );

  // Mini Dial Transformations
  const scaleMini = useSpring(
    useTransform(scrollY, [0, 1], [2, 1]),
    scaleConfig,
  );
  const showMini = useSpring(
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

  if (!soundData) return null;

  // const { data } = useSoundInfoQuery(soundData.id);

  // useEffect(() => {
  //   if (data) {
  //     setRatings(Object.values(data.ratings).map(Number));
  //   }
  // }, [data]);

  const artwork = MusicKit.formatArtworkURL(
    soundData.attributes.artwork,
    800,
    800,
  );

  const appleAlbumId =
    soundData.type === "albums"
      ? soundData.id
      : (soundData as SongData).relationships.albums.data[0].id;

  return (
    <>
      {/* Art */}
      <motion.div
        initial={{
          borderRadius: 16,
          scale: 1,
          x: 0,
        }}
        style={{
          borderRadius: borderRad,
          scale: scaleArt,
          x: xArt,
        }}
        className="shadow-soundArt pointer-events-auto flex-shrink-0 origin-top-left overflow-hidden sticky top-8"
      >
        <Image
          src={artwork}
          alt={`${soundData.attributes.name}'s artwork`}
          width={432}
          height={432}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      </motion.div>

      <Artifacts soundId={appleAlbumId} sortOrder={sortOrder} range={range} />

      {/* Titles */}
      <motion.div
        style={{
          opacity: showMini,
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
          <>
            {/* Big Dial */}
            <motion.div
              className={`point absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center drop-shadow-xl will-change-transform`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: hideDial,
              }}
              initial={{
                x: isOpen ? 72 : -72,
                y: isOpen ? -72 : 72,
                scale: isOpen ? 0.25 : 1,
                opacity: isOpen ? 0 : 1,
              }}
            >
              <Dial ratings={[0, 0, 0, 0, 0]} average={0} count={0} />
            </motion.div>

            {/*/!* Mini Dial *!/*/}
            {/*<motion.div*/}
            {/*  className={`absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center will-change-transform`}*/}
            {/*  style={{*/}
            {/*    x: xDial,*/}
            {/*    y: yDial,*/}
            {/*    scale: scaleMini,*/}
            {/*    opacity: showMini,*/}
            {/*  }}*/}
            {/*  initial={{*/}
            {/*    x: isOpen ? 72 : -72,*/}
            {/*    y: isOpen ? -72 : 72,*/}
            {/*    scale: isOpen ? 0.25 : 1,*/}
            {/*    opacity: isOpen ? 1 : 0,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <DialMini*/}
            {/*    ratings={data ? ratings : [0, 0, 0, 0, 0]}*/}
            {/*    onRangeChange={handleRangeChange}*/}
            {/*    average={data ? data.avg_rating : 0}*/}
            {/*  />*/}
            {/*</motion.div>*/}
          </>,
          cmdk,
        )}
    </>
  );
};

export default Sound;
