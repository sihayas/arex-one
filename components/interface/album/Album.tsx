import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useSoundContext } from "@/context/SoundContext";

import { useAlbumQuery } from "@/lib/apiHelper/album";
import RenderArtifacts from "./sub/RenderArtifacts";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Filter from "@/components/interface/album/sub/Filter";

import { AlbumData, TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

import Statline from "@/components/interface/album/sub/Dial";

const springConfig = { damping: 40, stiffness: 400, mass: 1 };
const artScaleConfig = { damping: 16, stiffness: 112 };
const artXConfig = { damping: 20, stiffness: 160 };
const artYConfig = { damping: 20, stiffness: 180 };

const Album = () => {
  const { selectedSound } = useSoundContext();
  const { scrollContainerRef } = useInterfaceContext();

  const [open, setOpen] = useState(false);
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "highlights" | "positive" | "critical"
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
  const [scope, animate] = useAnimate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest >= 1 && !open) {
      setOpen(true);
      console.log("open");
    } else if (latest === 0) {
      setOpen(false);
      console.log("close");
    }
  });

  useEffect(() => {
    const animateOpen = async () => {
      await animate(
        scope.current,
        {
          scale: 0.1,
          borderRadius: 124,
          x: [0, -480, 160],
          y: 160,
        },
        {
          type: "spring",
          x: artXConfig,
          y: artYConfig,
          scale: artScaleConfig,
        },
      );
    };

    const animateClose = async () => {
      await animate(
        scope.current,
        {
          scale: 1,
          borderRadius: 0,
          x: 0,
          y: 0,
        },
        {
          type: "spring",
          x: artXConfig,
          y: artYConfig,
          scale: artScaleConfig,
        },
      );
    };

    if (open) {
      animateOpen();
    } else {
      animateClose();
    }
  }, [open, animate, scope]);

  const artScale = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.1]),
    artScaleConfig,
  );

  const xArtKeyframes = useTransform(scrollY, [0, 1, 2], [0, -2400, 160]);
  const xArt = useSpring(xArtKeyframes, artXConfig);

  const yArt = useSpring(useTransform(scrollY, [0, 1], [0, 160]), artYConfig);

  const dialX = useSpring(
    useTransform(scrollY, [0, 1], [-160, -32]),
    springConfig,
  );

  const dialY = useSpring(
    useTransform(scrollY, [0, 1], [-160, -32]),
    springConfig,
  );

  const dialScale = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.6]),
    springConfig,
  );

  // Rating footer opacity
  const borderRadius = useSpring(useTransform(scrollY, [0, 24], [32, 124]), {
    damping: 36,
    stiffness: 400,
  });

  // Initializes album. If the album doesn't have detailed data fetch it.
  const { isLoading } = useAlbumQuery();

  if (!selectedSound) return;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      <motion.div
        // style={{
        //   x: xArt,
        //   y: yArt,
        //   scale: artScale,
        //   borderRadius,
        // }}
        ref={scope}
        className="fixed pointer-events-none overflow-hidden z-50 right-0 bottom-0"
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
      <RenderArtifacts
        sound={selectedSound.sound as AlbumData}
        sortOrder={sortOrder}
      />

      {/* Sort/Filter */}
      <motion.div
        className={`w-[calc(100%-88px)] z-10 p-8 pt-0 pb-4 pr-14 absolute bottom-0`}
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
        {/*<motion.div*/}
        {/*  id={`rating`}*/}
        {/*  className={`text-[64px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-baskerville`}*/}
        {/*  style={{ color: textColor }}*/}
        {/*>*/}
        {/*  3.7*/}
        {/*</motion.div>*/}
      </motion.div>

      <motion.div
        style={{
          backgroundColor: `#${selectedSound.sound.attributes.artwork.bgColor}`,
        }}
        className="absolute bottom-12 right-12 w-16 h-16 blur-lg"
      ></motion.div>
    </motion.div>
  );
};

export default Album;
