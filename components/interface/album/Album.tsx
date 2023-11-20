import Image from "next/image";
import React, { useState } from "react";

import { useSound } from "@/context/SoundContext";

import { useAlbumQuery } from "@/lib/apiHandlers/albumAPI";
import RenderRecords from "./RenderRecords";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Filter from "@/components/interface/album/sub/Filter";

import { TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { JellyComponent } from "@/components/global/Loading";

import Statline from "@/components/interface/album/sub/Dial";

const springConfig = { damping: 40, stiffness: 400, mass: 1 };

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();
  const { scrollContainerRef } = useInterfaceContext();

  // Filter state
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "positive" | "negative"
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

  // Album artwork scale
  let albumX = useSpring(
    useTransform(scrollY, [0, 24], [0, -48]),
    springConfig,
  );
  let albumY = useSpring(
    useTransform(scrollY, [0, 24], [0, -48]),
    springConfig,
  );
  let albumScale = useSpring(
    useTransform(scrollY, [0, 24], [1, 0.8667]),
    springConfig,
  );

  const dialX = useSpring(
    useTransform(scrollY, [0, 24], [-160, -32]),
    springConfig,
  );
  const dialY = useSpring(
    useTransform(scrollY, [0, 24], [-160, -32]),
    springConfig,
  );
  const dialScale = useSpring(
    useTransform(scrollY, [0, 24], [1, 0.5]),
    springConfig,
  );
  const textColor = useTransform(scrollY, [0, 24], ["#FFF", "#333"]);

  // Rating footer opacity
  const borderRadius = useSpring(useTransform(scrollY, [0, 24], [32, 16]), {
    damping: 36,
    stiffness: 400,
  });

  // Initializes album. If the album doesn't have detailed data it gets it.
  const { isLoading } = useAlbumQuery();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      {!selectedSound || isLoading ? (
        <JellyComponent className={``} isVisible={true} />
      ) : (
        <>
          <motion.div
            style={{
              // x: albumX,
              // y: albumY,
              borderRadius,
              scale: albumScale,
              // transformOrigin: "bottom right",
            }}
            className="pointer-events-none overflow-hidden"
          >
            <Image
              src={selectedSound.artworkUrl || "/public/images/default.png"}
              alt={`${selectedSound.sound.attributes.name} artwork`}
              width={480}
              height={480}
              quality={100}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </motion.div>
          {/* Empty 480 px ghost div to take up space */}
          <div className="w-full h-[24px]">&nbsp;</div>

          {/* Entries */}
          <RenderRecords
            soundId={`${!activeSong ? selectedSound.sound.id : activeSong.id}`}
            sortOrder={sortOrder}
          />

          {/* Sort/Filter */}
          <motion.div
            className={`w-[calc(100%-88px)] z-10 p-8 pt-0 pb-4 pr-8 absolute bottom-0`}
          >
            {"relationships" in selectedSound.sound &&
              "tracks" in selectedSound.sound.relationships && (
                <Filter
                  albumName={selectedSound.sound.attributes.name}
                  songs={selectedSound.sound.relationships.tracks.data}
                  onActiveSongChange={handleActiveSongChange}
                />
              )}
            {/*<div className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 outline outline-silver outline-1 rounded-full">*/}
            {/*  <Sort onSortOrderChange={handleSortOrderChange} />*/}
            {/*</div>*/}
          </motion.div>

          {/* Rating */}
          <motion.div
            className={`fixed z-50 pointer-events-none right-0 bottom-0 flex items-center justify-center`}
            style={{
              x: dialX,
              y: dialY,
              scale: dialScale,
              transformOrigin: "bottom right",
            }}
          >
            <Statline ratings={[4, 8900, 2445, 5000, 500]} />
            <motion.div
              id={`rating`}
              className={`text-[64px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-baskerville`}
              style={{ color: textColor }}
            >
              3.7
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Album;
