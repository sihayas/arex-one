import React from "react";
import Image from "next/image";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleSoundClick } from "@/hooks/handlePageChange/useHandleSoundClick";
import { AlbumDBData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/CMDKContext";

import Stars from "@/components/global/Stars";

interface ArtworkHeaderProps {
  albumId: string;
  rating?: number;
  album?: AlbumDBData;
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = ({
  albumId,
  rating,
}) => {
  const { handleSelectSound } = useHandleSoundClick();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId,
    "676"
  );

  const handleClick = async () => {
    const imgElement = imgRef.current;

    if (imgElement && albumData && artworkUrl) {
      await handleSelectSound(imgElement, albumData, artworkUrl);
    }
  };

  return (
    <div onClick={handleClick} className="flex flex-col w-fit hoverable-medium">
      {/* Art  */}
      <Image
        className="rounded-[8px] shadow-index"
        src={
          isLoading
            ? "/images/loading.webp"
            : artworkUrl || "/images/default.webp"
        }
        alt={`artwork`}
        width={338}
        height={338}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        ref={imgRef}
        loading="lazy"
      />
      <div className="relative">
        {rating ? (
          <div className="absolute -bottom-4 -left-4">
            <Stars
              className="bg-white p-1 rounded-full border border-silver"
              rating={rating}
              color={"#000"}
            />
          </div>
        ) : null}

        <div className="absolute flex flex-col bottom-4 left-4 rounded-lg gap-1">
          <div className="font-semibold text-[13px] text-white">
            {albumData?.attributes.name}
          </div>
          <div className="text-[13px] text-white">
            {albumData?.attributes.artistName}
          </div>
        </div>
      </div>
    </div>
  );
};
