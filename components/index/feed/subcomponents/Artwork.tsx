import React from "react";
import Image from "next/image";

import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";

interface ArtworkProps {
  album: AlbumData;
}

export const Artwork = ({ album }: ArtworkProps) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const artworkUrl = GenerateArtworkUrl(album.attributes.artwork.url, "960");

  const handleSoundClick = async () => {
    const imgElement = ref.current;
    if (imgElement && album && artworkUrl) {
      await handleSelectSound(imgElement, album, artworkUrl);
    }
  };

  return (
    <motion.div layoutId={`album-${album.id}`}>
      <Image
        onClick={handleSoundClick}
        className="rounded-[7.5px] shadow-feedArt"
        src={artworkUrl || "/images/default.webp"}
        alt={`artwork`}
        width={384}
        height={384}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        loading="lazy"
        quality={100}
        ref={ref}
      />
    </motion.div>
  );
};
