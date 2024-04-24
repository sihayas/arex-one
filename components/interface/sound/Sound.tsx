import React, { useEffect, useState } from "react";
import Image from "next/image";

import Entries from "./render/Entries";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { PageSound, useInterfaceContext } from "@/context/Interface";

import Dial from "@/components/interface/sound/items/Dial";
import { createPortal } from "react-dom";
import Sort from "@/components/interface/sound/items/Sort";
import { useSoundInfoQuery } from "@/lib/helper/interface/sound";

const generalConfig = { damping: 20, stiffness: 100 };
const artConfig = { damping: 34, stiffness: 200 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Sound = () => {
  const [range, setRange] = useState<number | null>(null);
  const [ratings, setRatings] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const { scrollContainerRef, activePage } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const translateY = useSpring(
    useTransform(scrollY, [0, 1], [-688, 0]),
    generalConfig,
  );

  const scaleArt = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.658]),
    artConfig,
  );
  const borderRad = useSpring(
    useTransform(scrollY, [0, 1], [20, 40]),
    generalConfig,
  );
  const xDial = useSpring(useTransform(scrollY, [0, 1], [-32, 0]), artConfig);
  const yDial = useSpring(useTransform(scrollY, [0, 1], [32, 0]), artConfig);

  const pageSound = activePage.data as PageSound;
  const { data } = useSoundInfoQuery(pageSound.id);

  console.log("Data: ", data);

  useEffect(() => {
    if (!data) return;

    const getRatingValue = (key: string) => parseInt(data[key], 10) || 0;

    const ratingArray = [
      getRatingValue("rating_half") + getRatingValue("rating_one"),
      getRatingValue("rating_one_half") + getRatingValue("rating_two"),
      getRatingValue("rating_two_half") + getRatingValue("rating_three"),
      getRatingValue("rating_three_half") + getRatingValue("rating_four"),
      getRatingValue("rating_four_half") + getRatingValue("rating_five"),
    ];

    setRatings(ratingArray);

    console.log("Rating Array: ", ratingArray);
  }, [data]);

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };
  const handleRangeChange = (newRange: number | null) => {
    setRange(newRange);
  };

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

  if (!data) return null;

  return (
    <>
      {/* Ghost Div Art PlaceHolder*/}
      <div className={`min-w-[688px] min-h-[688px] z-20 snap-start`} />

      {/* Art */}
      <motion.div
        style={{ borderRadius: borderRad, scale: scaleArt }}
        className="shadow-soundArt flex-shrink-0 absolute top-8 left-8 origin-top-left"
      >
        <motion.div
          style={{ borderRadius: borderRad }}
          className={`overflow-hidden`}
        >
          <Image
            src={pageSound.artwork}
            alt={`${data.name}'s artwork`}
            width={312}
            height={312}
            quality={100}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </motion.div>
        {/* Titles */}
        <motion.div
          className={`text-gray2 absolute top-[328px] z-10 flex w-full flex-col text-end`}
        >
          <p className={`text-gray2 text-xl font-medium`}>{data.artist_name}</p>
          <p className={`text-xl font-bold`}>{data.name}</p>
        </motion.div>
      </motion.div>

      {/* Add Snap-Start here*/}
      <motion.div
        style={{ translateY }}
        initial={{ filter: "blur(20px)", scale: 0, opacity: 0 }}
        animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
        exit={{ filter: "blur(20px)", scale: 0, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        className={`min-h-max w-full max-w-full snap-start`}
      >
        <Entries soundId={pageSound.id} sortOrder={sortOrder} range={range} />
      </motion.div>

      <div className={`min-w-[688px] min-h-[688px] z-20`} />

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
            exit={{ opacity: 0, scale: 0 }}
          >
            <Dial
              ratings={ratings}
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
