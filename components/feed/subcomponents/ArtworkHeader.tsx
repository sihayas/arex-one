import Image from "next/image";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleAlbumClick } from "@/hooks/handlePageChange/useHandleAlbumClick";
import { AlbumDBData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import React from "react";
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
  const { handleSelectAlbum } = useHandleAlbumClick();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const { setIsVisible } = useCMDK();
  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId,
    "676"
  );

  // Trigger CMDK
  const handleClick = async () => {
    const imgElement = imgRef.current;

    if (imgElement && albumData && artworkUrl) {
      await handleSelectAlbum(imgElement, albumData, artworkUrl);
      setIsVisible(true);
    }
  };

  return (
    <div onClick={handleClick} className="flex flex-col w-fit hoverable-medium">
      {/* Art  */}
      <Image
        className="rounded-[12px] shadow-index"
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
          <div className="font-medium text-xs text-white">
            {albumData?.attributes.name}
          </div>
          <div className="text-xs text-white">
            {albumData?.attributes.artistName}
          </div>
        </div>
      </div>
    </div>
  );
};
