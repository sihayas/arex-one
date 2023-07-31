import Image from "next/image";
import { FeedHeaderIcon } from "../icons";

import { Stars } from "../cmdk/generics";
import useFetchArtworkUrl from "@/hooks/useFetchArtworkUrl";

interface FooterProps {
  albumId: string;
  rating?: number;
}

export const Footer: React.FC<FooterProps> = ({ albumId, rating }) => {
  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId,
    "676"
  );

  return (
    <div className="flex flex-col drop-shadow-lg">
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
