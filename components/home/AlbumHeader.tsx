import Image from "next/image";
import { FeedHeaderIcon } from "../icons";

import { Stars, generateArtworkUrl } from "../cmdk/generics";
import { useQuery } from "@tanstack/react-query";
import { getAlbumById } from "@/lib/musicKit";

interface AlbumHeaderProps {
  albumId: string;
  rating?: number;
}

const fetchArtworkUrl = async (albumId: string) => {
  if (!albumId) {
    console.log("fetchArtworkURl didnt get an albumId");
    return null;
  }

  const albumData = await getAlbumById(albumId);
  const artworkUrl = generateArtworkUrl(
    albumData.attributes.artwork.url,
    "676"
  );

  return { artworkUrl, albumData };
};

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  albumId,
  rating,
}) => {
  // fetch artwork
  const { data: data, isLoading: isDataLoading } = useQuery(
    ["albumArtworkUrl", albumId],
    () => fetchArtworkUrl(albumId),
    {
      enabled: !!albumId,
    }
  );

  return (
    <div className="flex flex-col drop-shadow-lg">
      {/* Art  */}
      <Image
        className="rounded-[16px] rounded-b-none translate-x-[22px]"
        src={data?.artworkUrl || "/images/default.webp"}
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
            {data?.albumData.attributes.name}
          </div>
          <div className="text-xs text-gray3">
            {data?.albumData.attributes.artistName}
          </div>
        </div>
      </div>
    </div>
  );
};
