import React from "react";
import Image from "next/image";

import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData, SongData } from "@/types/appleTypes";
import { motion } from "framer-motion";

interface ArtworkProps {
  sound: AlbumData | SongData;
  width?: number;
  height?: number;
  className?: string;
  outerClassName?: string;
}

export const Artwork = ({
  sound,
  width = 352,
  height = 352,
  className,
  outerClassName,
}: ArtworkProps) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const artworkUrl = GenerateArtworkUrl(sound.attributes.artwork.url, "1200");

  const handleSoundClick = async () => {
    await handleSelectSound(sound, artworkUrl);
  };

  return (
    <motion.div
      initial={{
        scale: 1,
        boxShadow:
          "0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      }}
      whileHover={{
        scale: 0.98,
        boxShadow:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
      }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className={`${outerClassName}`}
    >
      <Image
        onClick={handleSoundClick}
        className={`${className} cursor-pointer`}
        src={artworkUrl}
        alt={`artwork`}
        width={width}
        height={height}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        loading="lazy"
        quality={100}
        ref={ref}
      />
    </motion.div>
  );
};
