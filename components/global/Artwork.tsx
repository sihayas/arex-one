import React from "react";
import Image from "next/image";

import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData, SongData } from "@/types/appleTypes";

interface ArtworkProps {
  sound: AlbumData | SongData;
  width?: number;
  height?: number;
  className?: string;
}

export const Artwork = ({
  sound,
  width = 368,
  height = 368,
  className,
}: ArtworkProps) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const artworkUrl = GenerateArtworkUrl(sound.attributes.artwork.url, "1200");

  const handleSoundClick = async () => {
    await handleSelectSound(sound, artworkUrl);
  };

  return (
    <Image
      onClick={handleSoundClick}
      className={`rounded-[7.5px] outline outline-silver outline-[.5px] ${className}`}
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
  );
};
