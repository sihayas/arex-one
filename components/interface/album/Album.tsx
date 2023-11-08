import Image from "next/image";
import React, { useState } from "react";

import { useSound } from "@/context/SoundContext";

import { useAlbumQuery } from "@/lib/apiHandlers/albumAPI";
import RenderRecords from "./sub/RenderRecords";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Filter from "@/components/interface/album/sub/Filter";

import { TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { JellyComponent } from "@/components/global/Loading";

import GradientBlur from "@/components/interface/album/sub/GradientBlur";
import Statline from "@/components/interface/album/sub/CircleStatline";

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();
  const { scrollContainerRef } = useInterfaceContext();

  // Filter expansion
  const [expand, setExpand] = useState<boolean>(false);

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

  // Define the spring configuration just once
  const springConfig = { damping: 40, stiffness: 400, mass: 1 };

  // Album artwork scale
  let y = useSpring(useTransform(scrollY, [0, 64], [0, -24]), springConfig);
  let x = useSpring(useTransform(scrollY, [0, 64], [0, -24]), springConfig);
  let scale = useSpring(useTransform(scrollY, [0, 64], [1, 0]), springConfig);

  const dialX = useSpring(
    useTransform(scrollY, [0, 64], [-160, -8]),
    springConfig,
  );
  const dialY = useSpring(
    useTransform(scrollY, [0, 64], [-160, -8]),
    springConfig,
  );
  const dialScale = useSpring(
    useTransform(scrollY, [0, 64], [1, 0.75]),
    springConfig,
  );
  const dialTextColor = useTransform(scrollY, [0, 128], ["#FFF", "#333"]);

  // Rating footer opacity
  const borderRadius = useSpring(useTransform(scrollY, [0, 24], [32, 240]), {
    damping: 36,
    stiffness: 400,
  });
  const opacity = useTransform(scrollY, [0, 160], [0, 1]);

  // Initializes album. If the album doesn't have detailed data it gets it.
  const { isLoading, error } = useAlbumQuery();

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
              x,
              y,
              borderRadius,
              scale,
              transformOrigin: "bottom right",
            }}
            className="pointer-events-none overflow-hidden fixed z-20 shadow-shadowKitHigh bottom-0 right-0 border border-gray3"
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
          <div className="w-full h-[480px]">&nbsp;</div>

          {/* Entries */}
          <AnimatePresence>
            <RenderRecords
              soundId={`${
                !activeSong ? selectedSound.sound.id : activeSong.id
              }`}
              sortOrder={sortOrder}
            />
          </AnimatePresence>

          {/*<GradientBlur expand={expand} />*/}

          {/* Rating & Sort */}
          <motion.div
            className={`w-[calc(100%-128px)] z-10 p-8 pb-0 pt-0 absolute bottom-0`}
          >
            {"relationships" in selectedSound.sound &&
              "tracks" in selectedSound.sound.relationships && (
                <Filter
                  albumName={selectedSound.sound.attributes.name}
                  songs={selectedSound.sound.relationships.tracks.data}
                  onActiveSongChange={handleActiveSongChange}
                  handleSortOrderChange={handleSortOrderChange}
                  expand={expand}
                  setExpand={setExpand}
                />
              )}
          </motion.div>

          <motion.div
            className={`fixed z-50 pointer-events-none right-0 bottom-0 flex items-center justify-center drop-shadow-sm`}
            style={{
              x: dialX,
              y: dialY,
              scale: dialScale,
              transformOrigin: "bottom right",
              color: dialTextColor,
            }}
          >
            <Statline ratings={[4, 8900, 244, 5000, 5000]} average={2.4} />
            <div
              className={`text-[64px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-baskerville text-inherit`}
            >
              4.2
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Album;
