import { generateArtworkUrl } from "@/components/cmdk/generics";
import { AlbumData } from "@/lib/interfaces";
import Image from "next/image";
import { useSelectAlbum } from "@/hooks/useSelectAlbum";

export const SoundPreview = (album: AlbumData) => {
  const { handleSelectAlbum } = useSelectAlbum();

  return (
    <div className="w-fit flex gap-8">
      {/* Names  */}
      <div className="flex flex-col justify-end items-end gap-2 mb-8">
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
        className="shadow-medium rounded-[16px]"
        src={generateArtworkUrl(album.attributes.artwork.url, "1024")}
        width={512}
        height={512}
        alt="alt"
        onDragStart={(e) => e.preventDefault()}
        onSelect={() =>
          handleSelectAlbum(
            document.getElementById(album.id) as HTMLImageElement,
            album,
            generateArtworkUrl(album.attributes.artwork.url, "10")
          )
        }
      />

      {/* other album details */}
    </div>
  );
};
