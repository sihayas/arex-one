import React, { useState } from "react";
import Image from "next/image";

import { useSoundContext } from "@/context/SoundContext";

import Artifacts from "./render/Artifacts";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { SongData } from "@/types/appleTypes";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";

import Dial from "@/components/interface/album/sub/Dial";
import DialMini from "@/components/interface/album/sub/DialMini";
import { createPortal } from "react-dom";
import { GetDimensions } from "@/components/interface/Interface";
import Sort from "@/components/interface/album/sub/Sort";

const scaleConfig = { damping: 20, stiffness: 122 };
const xConfig = { damping: 20, stiffness: 160 };
const yConfig = { damping: 20, stiffness: 100 };
const generalConfig = { damping: 36, stiffness: 400 };

export type SortOrder = "newest" | "starlight" | "appraisal" | "critical";

const Album = () => {
  const { scrollContainerRef, activePage } = useInterfaceContext();
  const { selectedSound } = useSoundContext();

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const activePageName: PageName = activePage.name as PageName;

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });
  const { target } = GetDimensions(activePageName);

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  // Art Transformations
  const xArtKF = useTransform(scrollY, [0, 1], [0, 16]);
  const yArtKF = useTransform(scrollY, [0, 1], [-(target.height - 432), -16]);
  const scaleArtKF = useTransform(scrollY, [0, 1], [1, 0.1389]);
  const borderKF = useTransform(scrollY, [0, 1], [32, 96]);

  const yArt = useSpring(yArtKF, yConfig);
  const xArt = useSpring(xArtKF, xConfig);
  const scaleArt = useSpring(scaleArtKF, scaleConfig);
  const borderRad = useSpring(borderKF, generalConfig);

  // Dial Transformations
  const xDialKF = useTransform(scrollY, [0, 1], [48, -16]);
  const yDialKF = useTransform(scrollY, [0, 1], [48, -16]);
  const scaleDialKF = useTransform(scrollY, [0, 1], [1, 0.25]);
  const hideDialKF = useTransform(scrollY, [0, 1], [1, 0]);

  const xDial = useSpring(xDialKF, xConfig);
  const yDial = useSpring(yDialKF, yConfig);
  const scaleDial = useSpring(scaleDialKF, scaleConfig);
  const hideDial = useSpring(hideDialKF, generalConfig);

  // Mini Dial Transformations
  const showMiniKF = useTransform(scrollY, [0, 1], [0, 1]);
  const scaleMiniKF = useTransform(scrollY, [0, 1], [1, 4]);

  const showMini = useSpring(showMiniKF, generalConfig);
  const scaleMiniText = useSpring(scaleMiniKF, generalConfig);

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
      <Artifacts soundId={albumId} sortOrder={sortOrder} />

      {/* Art */}
      <motion.div
        style={{
          borderRadius: borderRad,
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
            <motion.div
              className={`absolute z-50 right-0 bottom-0 flex items-center justify-center origin-bottom-right will-change-transform`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: hideDial,
              }}
            >
              <Dial ratings={[4, 8900, 2445, 5000000, 500]} average={3.8} />
            </motion.div>

            <motion.div
              className={`absolute z-50 right-0 bottom-0 flex items-center justify-center origin-bottom-right will-change-transform`}
              style={{
                x: xDial,
                y: yDial,
                scale: scaleDial,
                opacity: showMini,
              }}
            >
              <DialMini ratings={[4, 8900, 2445, 5000000, 500]} />
              <motion.div
                style={{
                  scale: scaleMiniText,
                  left: "50%",
                  bottom: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                className={`absolute pointer-events-none center-x center-y flex flex-col items-center justify-center text-center gap-4 text-black`}
              >
                <p className={`text-2xl font-serif leading-[16px]`}>3.8</p>
              </motion.div>
            </motion.div>
          </>,
          cmdk,
        )}
    </motion.div>
  );
};

export default Album;
