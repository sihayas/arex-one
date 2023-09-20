import Image from "next/image";

import { Command } from "cmdk";

import { SongData } from "@/lib/global/interfaces";
import { useHandleSearchClick } from "@/hooks/useInteractions/useHandleSearchClick";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

const Song = ({ song }: { song: SongData }) => {
  const artworkUrl = GenerateArtworkUrl(song.attributes.artwork.url, "90");
  const { handleSelectSearch } = useHandleSearchClick();

  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full border-b p-4 border-silver"
      onSelect={() =>
        handleSelectSearch(
          document.getElementById(song.id) as HTMLImageElement,
          song,
          artworkUrl
        )
      }
      key={song.id}
    >
      <div className="flex w-full items-center gap-4">
        <Image
          id={song.id}
          className="rounded-lg shadow-index"
          src={artworkUrl}
          alt={`${song.attributes.name} artwork`}
          width={36}
          height={36}
          draggable="false"
        />

        <div className="flex flex-col justify-center overflow-hidden">
          {/* Top */}
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-black">
            {song.attributes.name}
          </div>
          {/* Bottom */}
          <div className="flex items-center text-xs gap-[6px] text-gray">
            <div className="line-clamp-1">{song.attributes.albumName}</div>
            <div>&ndash;</div>
            <div className="line-clamp-1">{song.attributes.artistName}</div>
          </div>
        </div>
      </div>
    </Command.Item>
  );
};
export default Song;
