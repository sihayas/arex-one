import React from "react";
import Image from "next/image";

import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import ArtworkURL from "@/components/global/ArtworkURL";
import { AlbumData, SongData } from "@/types/appleTypes";
import { motion } from "framer-motion";

interface ArtworkProps {
  sound: AlbumData | SongData;
  width?: number;
  height?: number;
  className?: string;
  outerClassName?: string;
  bgColor?: string;
}

export const Artwork = ({
  sound,
  width = 352,
  height = 352,
  className,
  outerClassName,
  bgColor,
}: ArtworkProps) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const artworkUrl = ArtworkURL(sound.attributes.artwork.url, "1200");

  const handleSoundClick = async () => {
    await handleSelectSound(sound, artworkUrl);
  };

  return (
    <motion.div
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className={`${outerClassName} relative`}
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
      {/*  circle*/}
      <div
        style={{ backgroundColor: `#${bgColor}` }}
        className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[80px] -z-10`}
      />
    </motion.div>
  );
};
