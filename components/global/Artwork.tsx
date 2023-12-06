import React from "react";
import Image from "next/image";

import { useSound } from "@/hooks/usePage";
import ArtworkURL from "@/components/global/ArtworkURL";
import { AlbumData, SongData } from "@/types/appleTypes";
import { motion } from "framer-motion";
import Stars from "@/components/global/Stars";

interface ArtworkProps {
  sound: AlbumData | SongData;
  width?: number;
  height?: number;
  className?: string;
  outerClassName?: string;
  rating?: number;
  bgColor?: string;
  isFeed?: boolean;
  isAlbum?: boolean;
}

export const Artwork = ({
  sound,
  width = 352,
  height = 352,
  className,
  outerClassName,
  rating,
  bgColor,
  isFeed = false,
  isAlbum,
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
      {isFeed && (
        <>
          <div
            style={{
              background: `url('/images/nnnoise2.svg'), #${bgColor}`,
              backgroundRepeat: "repeat, no-repeat",
            }}
            className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full -z-10 blur-3xl`}
          />
          <div
            style={{
              background: `linear-gradient(to top, #${bgColor}, rgba(0,0,0,0)`,
            }}
            className="absolute bottom-0 w-full h-1/4 rounded-b-[16px]"
          />
          <Stars
            className={`bg-white/90 absolute bottom-4 left-4 rounded-full w-max z-10 p-1 px-2 shadow-shadowKitLow overflow-hidden ${
              isAlbum ? "max-w-[288px]" : "max-w-[96px]"
            } `}
            rating={rating}
            soundName={sound.attributes.name}
          />
        </>
      )}
    </motion.div>
  );
};
