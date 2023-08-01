import Image from "next/image";
import { FeedHeaderIcon } from "../icons";
import { Stars } from "../cmdk/generics";
import useFetchArtworkUrl from "@/hooks/useFetchArtworkUrl";
import { useSelectAlbum } from "@/hooks/useSelectAlbum";
import { AlbumDBData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import React from "react";

interface FooterProps {
  albumId: string;
  rating?: number;
  album?: AlbumDBData;
}

export const Footer: React.FC<FooterProps> = ({ albumId, rating }) => {
  const { handleSelectAlbum } = useSelectAlbum();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const { setIsVisible } = useCMDK();
  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId,
    "676"
  );

  const handleClick = async () => {
    const imgElement = imgRef.current;

    if (imgElement && albumData && artworkUrl) {
      await handleSelectAlbum(imgElement, albumData, artworkUrl);
      setIsVisible(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col drop-shadow-sm hoverable-medium"
    >
      {/* Art  */}
      <Image
        className="rounded-[16px] rounded-b-none translate-x-[22px]"
        src={
          isLoading
            ? "/images/loading.webp"
            : artworkUrl || "/images/default.webp"
        }
        alt={`artwork`}
        width={338} // Set this to a low value
        height={338} // Set this to the same low value
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        ref={imgRef}
      />
      <div className="relative">
        <FeedHeaderIcon height={70} color={"#FFF"} />
        {rating ? (
          <div className="absolute bottom-[6px] left-[6px]">
            <Stars rating={rating} color={"#000"} />
          </div>
        ) : null}

        <div className="absolute flex flex-col bottom-[30px] left-[38px]">
          <div className="font-medium text-xs text-gray2">
            {albumData?.attributes.name}
          </div>
          <div className="text-xs text-gray3">
            {albumData?.attributes.artistName}
          </div>
        </div>
      </div>
    </div>
  );
};
