import React from "react";
import Image from "next/image";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleSoundClick } from "@/hooks/handlePageChange/useHandleSoundClick";
import { AlbumDBData } from "@/lib/global/interfaces";

import ColorThief from "colorthief";

interface ArtworkHeaderProps {
  albumId?: string;
  songId?: string;
  album?: AlbumDBData;
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = ({
  albumId,
  songId,
}) => {
  const { handleSelectSound } = useHandleSoundClick();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const type = albumId ? "albumId" : "songId";
  const size = albumId ? "676" : songId ? "380" : "default";
  const width = albumId ? 338 : songId ? 180 : 338; // default width
  const height = albumId ? 338 : songId ? 180 : 338; // default height

  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId || songId,
    size,
    type
  );

  const handleClick = async () => {
    const imgElement = imgRef.current;

    if (imgElement && albumData && artworkUrl) {
      await handleSelectSound(imgElement, albumData, artworkUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col w-full hoverable-medium"
    >
      {/* Art */}
      <Image
        className="rounded-[16px] shadow-artworkFeed border border-silver"
        src={
          isLoading
            ? "/images/loading.webp"
            : artworkUrl || "/images/default.webp"
        }
        alt={`artwork`}
        width={width}
        height={height}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        ref={imgRef}
        loading="lazy"
        quality={100}
      />
    </div>
  );
};
