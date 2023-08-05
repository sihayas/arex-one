import { generateArtworkUrl } from "@/components/cmdk/generics";
import { AlbumData } from "@/lib/interfaces";
import Image from "next/image";
import { useSelectAlbum } from "@/hooks/useSelectAlbum";
import { useRef } from "react";

export const SoundPreview = ({
  album,
  index,
}: {
  album: AlbumData;
  index: number;
}) => {
  const { handleSelectAlbum } = useSelectAlbum();

  const artworkUrl = generateArtworkUrl(album.attributes.artwork.url, "1200");
  const imageRef = useRef(null); // Allows clicking art

  return (
    <div key={index} className="w-full flex pb-16">
      <div className="flex-none">
        {/* Artwork  */}
        <Image
          ref={imageRef}
          className="shadow-medium hoverable-medium rounded-[12px]"
          src={artworkUrl}
          width={600}
          height={600}
          alt="alt"
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          onClick={() => {
            if (imageRef.current) {
              handleSelectAlbum(imageRef.current, album, artworkUrl);
            }
          }}
        />
      </div>

      {/* About  */}
      <div className="flex items-end w-full p-16 justify-between">
        {/* Names  */}
        <div className="flex flex-col gap-2 w-[98px] pb-[10px]">
          <div className="text-sm font-medium text-black">
            {album.attributes.name}
          </div>
          <div className="text-xs text-gray2">
            {album.attributes.artistName}
          </div>
        </div>

        {/* Circle Here  */}
        <div className="flex flex-col w-[64px] h-[64px] rounded-full bg-white items-center justify-center border border-silver">
          <div className="text-xs font-bold">4.2</div>
          <div className="text-xs text-gray2">/ 12k</div>
        </div>
      </div>
    </div>
  );
};
