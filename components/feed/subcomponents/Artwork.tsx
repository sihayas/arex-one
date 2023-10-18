import React from "react";
import Image from "next/image";

import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/types/appleTypes";

interface ArtworkProps {
  album: AlbumData;
  width?: number;
  height?: number;
}

export const Artwork = ({ album, width = 368, height = 368 }: ArtworkProps) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const artworkUrl = GenerateArtworkUrl(album.attributes.artwork.url, "800");

  const handleSoundClick = async () => {
    await handleSelectSound(album, artworkUrl);
  };

  return (
    <Image
      onClick={handleSoundClick}
      className="rounded-[7.5px] outline outline-silver outline-[.5px]"
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
