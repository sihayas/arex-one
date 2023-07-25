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

  const artworkUrl = generateArtworkUrl(album.attributes.artwork.url, "1024");
  const imageRef = useRef(null); // Allows clicking art

  return (
    <div className="w-fit flex gap-8">
      {/* Names  */}
      <div className="flex flex-col justify-end items-end gap-2 mb-8">
        {/* Number  */}
        <div className="text-2xl text-gray3 mb-80">{index}</div>
        {/* Ratings Count */}
        <div className="flex items-center px-2 py-[2px] shadow-rating rounded-full mb-2 border border-silver max-w-fit">
          <div className="text-xs text-black">
            4.2 / <span className="text-gray2 text-[10px]">10k</span>
          </div>
        </div>
        <div className="text-black text-sm">{album.attributes.name}</div>
        <div className="text-gray2 text-xs">{album.attributes.artistName}</div>
      </div>
      {/* Artwork  */}
      <Image
        ref={imageRef}
        className="shadow-medium rounded-[16px] cursor"
        src={artworkUrl}
        width={512}
        height={512}
        alt="alt"
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          if (imageRef.current) {
            handleSelectAlbum(imageRef.current, album, artworkUrl);
          }
        }}
      />
    </div>
  );
};
