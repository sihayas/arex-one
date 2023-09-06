import React from "react";
import Image from "next/image";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { AlbumDBData } from "@/lib/global/interfaces";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";

interface ArtworkProps {
  albumId?: string;
  songId?: string;
  album?: AlbumDBData;
  type: "albumId" | "songId";
}

export const Artwork: React.FC<ArtworkProps> = ({ albumId, songId, type }) => {
  const { handleSelectSound } = useHandleSoundClick();
  const ref = React.useRef<HTMLImageElement>(null);

  const handleSoundClick = async () => {
    const imgElement = ref.current;
    if (imgElement && albumData && artworkUrl) {
      await handleSelectSound(imgElement, albumData, artworkUrl);
    }
  };

  const renderSize = albumId ? "960" : "380";
  const width = albumId ? 384 : 180;
  const height = albumId ? 384 : 180;

  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId || songId,
    renderSize,
    type
  );

  return (
    <Image
      onClick={handleSoundClick}
      className="rounded-[7.5px] shadow-feedArt"
      src={artworkUrl || "/images/default.webp"}
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

// const imgElement = imgRef.current;
// if (imgElement && albumData && artworkUrl) {
//   await handleSelectSound(imgElement, albumData, artworkUrl, {
//     x: translateX,
//     y: translateY,
//   }); // Pass the translate values here
// }
