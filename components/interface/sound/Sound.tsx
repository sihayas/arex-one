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

import { SongData } from "@/types/appleTypes";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";

import Dial from "@/components/interface/sound/sub/Dial";
import DialMini from "@/components/interface/sound/sub/DialMini";
import { createPortal } from "react-dom";
import Sort from "@/components/interface/sound/sub/Sort";
import { GetDimensions } from "@/components/interface/Interface";
import { useSoundInfoQuery } from "@/lib/helper/sound";

const scaleConfig = { damping: 16, stiffness: 122 };
const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const { scrollContainerRef, activePage, pages } = useInterfaceContext();
  const { base } = GetDimensions(activePage.name as PageName);

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [range, setRange] = useState<number | null>(null);

  const [ratings, setRatings] = useState<number[]>([]);

  const isOpen = activePage.isOpen;
  const soundData = activePage.sound!.data;

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const { data } = useSoundInfoQuery(soundData.id);

  useEffect(() => {
    if (data) {
      setRatings(Object.values(data.ratings).map(Number));
    }
  }, [data]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };
  const handleRangeChange = (newRange: number | null) => {
    setRange(newRange);
  };

  const artWidth = -base.width / 2;
  const xArt = useSpring(
    useTransform(scrollY, [0, 1], [artWidth + 32, -328]),
    xConfig,
  );
  const artHeight = -base.height / 2;
  const yArt = useSpring(
    useTransform(scrollY, [0, 1], [artHeight + 32, -494]),
    yConfig,
  );
  const rotateArt = useSpring(
    useTransform(scrollY, [0, 1], [0, -4]),
    generalConfig,
  );
  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.407]),
    scaleConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [20, 48]),
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
  const showMini = useSpring(
    useTransform(scrollY, [0, 1], [0, 1]),
    generalConfig,
  );

  const artwork = MusicKit.formatArtworkURL(
    soundData.attributes.artwork,
    800,
    800,
  );

  const appleAlbumId =
    soundData.type === "albums"
      ? soundData.id
      : (soundData as SongData).relationships.albums.data[0].id;

  const snap = activePage.isOpen ? "" : "snap-start";
  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Art Ghost Placeholder */}
      <div className={`min-h-[496px] min-w-[496px] ${snap}`} />

      <Artifacts soundId={appleAlbumId} sortOrder={sortOrder} range={range} />

      {/* Art */}
      {/*<motion.div*/}
      {/*  initial={{*/}
      {/*    borderRadius: isOpen ? 96 : 16,*/}
      {/*    scale: isOpen ? 0.1389 : 1,*/}
      {/*    x: isOpen ? -240 : artHeight + 32,*/}
      {/*    y: isOpen ? 26 : artWidth + 32,*/}
      {/*    rotate: isOpen ? -4 : 0,*/}
      {/*  }}*/}
      {/*  style={{*/}
      {/*    borderRadius: borderRad,*/}
      {/*    scale: scaleArt,*/}
      {/*    y: yArt,*/}
      {/*    x: xArt,*/}
      {/*    rotate: rotateArt,*/}
      {/*  }}*/}
      {/*  className="pointer-events-none absolute left-1/2 top-1/2 z-10 min-h-[432px] min-w-[432px] origin-top-left overflow-hidden"*/}
      {/*>*/}
      {/*  <Image*/}
      {/*    src={artwork}*/}
      {/*    alt={`${soundData.attributes.name}'s artwork`}*/}
      {/*    width={432}*/}
      {/*    height={432}*/}
      {/*    quality={100}*/}
      {/*    draggable="false"*/}
      {/*    onDragStart={(e) => e.preventDefault()}*/}
      {/*  />*/}
      {/*</motion.div>*/}

      {/* Titles */}
      <motion.div
        style={{
          opacity: showMini,
        }}
        className={`center-x shadow-shadowKitHigh absolute bottom-8 z-10 flex origin-bottom flex-col items-center justify-center -space-y-[1px] rounded-2xl bg-white px-4 pb-[13px] pt-[10px]`}
      >
        <p className={`text-center text-base font-bold text-black`}>
          {soundData.attributes.name}
        </p>
        <p
          className={`text-gray2 line-clamp-1 text-center text-sm font-medium`}
        >
          {soundData.attributes.artistName}
        </p>
      </motion.div>

      {/* Sort */}
      <div className={`absolute bottom-[92px] left-[92px]`}>
        <Sort onSortOrderChange={handleSortOrderChange} />
      </div>

      {/* Dial */}
      {cmdk &&
        createPortal(
          <>
            {/* Big Dial */}
            <motion.div
              className={`absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center drop-shadow-xl will-change-transform point`}
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
              <Dial
                ratings={data ? ratings : [0, 0, 0, 0, 0]}
                average={data ? data.avg_rating : 0}
                count={data ? data.ratings_count : 0}
              />
            </motion.div>

            {/* Mini Dial */}
            <motion.div
              className={`absolute bottom-0 left-0 flex origin-bottom-left items-center justify-center will-change-transform`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: showMini,
              }}
              initial={{
                x: isOpen ? 72 : -72,
                y: isOpen ? -72 : 72,
                scale: isOpen ? 0.25 : 1,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <DialMini
                ratings={data ? ratings : [0, 0, 0, 0, 0]}
                onRangeChange={handleRangeChange}
                average={data ? data.avg_rating : 0}
              />
            </motion.div>
          </>,
          cmdk,
        )}
    </>
  );
};

export default Sound;
