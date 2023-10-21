import Image from "next/image";

import { Command } from "cmdk";

import { AlbumData } from "@/types/appleTypes";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { useSound } from "@/context/SoundContext";
import { useInputContext } from "@/context/InputContext";

const Album = ({ album }: { album: AlbumData }) => {
  const artworkUrl = GenerateArtworkUrl(album.attributes.artwork.url, "1200");
  const { setSelectedFormSound } = useSound();
  const { inputValue, setInputValue, setStoredInputValue } = useInputContext();

  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full p-4 will-change-transform"
      onSelect={() => {
        setStoredInputValue(inputValue);
        setInputValue("");
        setSelectedFormSound({ sound: album, artworkUrl });
      }}
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
          <div className="flex items-center text-xs gap-[6px] text-gray">
            <div className="font-medium">ALBUM</div>
            {/*<div>&middot;</div>*/}
            {/*<div className="line-clamp-1">{album.attributes.artistName}</div>*/}
          </div>
          <div className="text-sm text-black line-clamp-1">
            {album.attributes.name}
          </div>
        </div>
      </div>
    </Command.Item>
  );
};

export default Album;
