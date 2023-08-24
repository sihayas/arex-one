import React from "react";
import Image from "next/image";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleSoundClick } from "@/hooks/handlePageChange/useHandleSoundClick";
import { AlbumDBData } from "@/lib/global/interfaces";

import Stars from "@/components/global/Stars";

interface ArtworkHeaderProps {
  albumId?: string;
  songId?: string;
  rating?: number;
  album?: AlbumDBData;
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = ({
  albumId,
  songId,
  rating,
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
    <div onClick={handleClick} className="flex flex-col w-fit hoverable-medium">
      {/* Art */}
      <Image
        className="rounded-[8px] rounded-bl-2xl shadow-index"
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
      <div className="relative">
        {rating ? (
          <div className="absolute bottom-0 left-0">
            <Stars
              className="bg-white p-1 rounded-full border border-silver"
              rating={rating}
              color={"#000"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
