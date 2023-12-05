import React from "react";
import Image from "next/image";

import { useSound } from "@/hooks/usePage";
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
  const { handleSelectSound } = useSound();
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
        loading="lazy"
        quality={100}
        ref={ref}
      />
      {/*  circle*/}
    </motion.div>
  );
};
