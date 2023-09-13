import Image from "next/image";

import { Command } from "cmdk";

import { AlbumData } from "@/lib/global/interfaces";
import { useHandleSearchClick } from "@/hooks/useInteractions/useHandleSearchClick";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

const Album = ({ album }: { album: AlbumData }) => {
  const { handleSelectSearch } = useHandleSearchClick();
  const artworkUrl = GenerateArtworkUrl(album.attributes.artwork.url, "90");

  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full border-b p-4 border-silver"
      onSelect={() =>
        handleSelectSearch(
          document.getElementById(album.id) as HTMLImageElement,
          album,
          artworkUrl
        )
      }
    >
      <div className="flex w-full items-center gap-4">
        <Image
          id={album.id}
          className="rounded-lg shadow-index"
          src={artworkUrl}
          alt={`${album.attributes.name} artwork`}
          width={36}
          height={36}
          draggable="false"
        />

        <div className="flex flex-col justify-center overflow-hidden">
          <div className="text-sm font-medium text-black line-clamp-1">
            {album.attributes.name}
          </div>
          <div className="flex items-center text-xs gap-[6px] text-gray">
            <div className="line-clamp-1">{album.attributes.artistName}</div>
            <div>&middot;</div>
            <div className="">{album.attributes.releaseDate.split("-")[0]}</div>
          </div>
        </div>
      </div>
    </Command.Item>
  );
};

export default Album;
