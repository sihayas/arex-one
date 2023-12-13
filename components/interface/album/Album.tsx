import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useSoundContext } from "@/context/SoundContext";

import RenderArtifacts from "./sub/RenderArtifacts";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { AlbumData, SongData, TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

import Statline from "@/components/interface/album/sub/Dial";
import { createPortal } from "react-dom";

const springConfig = { damping: 22, stiffness: 180 };
const scaleArtConfig = { damping: 20, stiffness: 122 };
const xArtConfig = { damping: 20, stiffness: 160 };
const yArtConfig = { damping: 20, stiffness: 180 };

const Album = () => {
  const { selectedSound } = useSoundContext();
  const { scrollContainerRef } = useInterfaceContext();
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

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

  const xArtKeyframes = useTransform(scrollY, [0, 1], [0, -222]);
  const xArt = useSpring(xArtKeyframes, xArtConfig);

  const yArtKeyframes = useTransform(scrollY, [0, 1], [0, -48]);
  const yArt = useSpring(yArtKeyframes, yArtConfig);

  const scaleArtKeyframes = useTransform(scrollY, [0, 1], [1, 0.1]);
  const scaleArt = useSpring(scaleArtKeyframes, scaleArtConfig);

  const xDialKeyframes = useTransform(scrollY, [0, 1], [-176, -206]);
  const xDial = useSpring(xDialKeyframes, springConfig);

  const yDialKeyframes = useTransform(scrollY, [0, 1], [-176, -32]);
  const yDial = useSpring(yDialKeyframes, springConfig);

  const scaleDialKeyframes = useTransform(scrollY, [0, 1], [1, 0.6]);
  const scaleDial = useSpring(scaleDialKeyframes, springConfig);

  const borderKeyframes = useTransform(scrollY, [0, 1], [32, 124]);
  const borderRadius = useSpring(borderKeyframes, {
    damping: 36,
    stiffness: 400,
  });

  if (!selectedSound) return;

  let albumId;

  if (selectedSound.sound.type === "albums") {
    albumId = selectedSound.sound.id;
  } else {
    const song = selectedSound.sound as SongData;
    albumId = song.relationships.albums.data[0].id;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px]"
    >
      {createPortal(
        <motion.div
          style={{
            x: xArt,
            y: yArt,
            scale: scaleArt,
            borderRadius,
            width: 576,
            height: 576,
          }}
          className="absolute pointer-events-none overflow-hidden z-50 right-0 bottom-0 origin-bottom-right shadow-shadowKitHigh"
        >
          <Image
            src={selectedSound.artworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={576}
            height={576}
            quality={100}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </motion.div>,
        cmdk,
      )}

      {createPortal(
        <motion.div
          className={`absolute z-50 pointer-events-none right-0 bottom-0 flex items-center justify-center drop-shadow`}
          style={{
            x: xDial,
            y: yDial,
            scale: scaleDial,
            transformOrigin: "bottom right",
          }}
        >
          <Statline ratings={[4, 8900, 2445, 5000, 500]} />
        </motion.div>,
        cmdk,
      )}

      {/* Entries */}
      <RenderArtifacts soundId={albumId} sortOrder={sortOrder} />

      {/*<div className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 outline outline-silver outline-1 rounded-full">*/}
      {/*  <Sort onSortOrderChange={handleSortOrderChange} />*/}
      {/*</div>*/}
    </motion.div>
  );
};

export default Album;
