import Image from "next/image";

import { Command } from "cmdk";

import { SongData } from "@/types/appleTypes";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { useSound } from "@/context/SoundContext";
import { useInputContext } from "@/context/InputContext";

const Song = ({ song }: { song: SongData }) => {
  const artworkUrl = GenerateArtworkUrl(song.attributes.artwork.url, "800");
  const { setSelectedFormSound } = useSound();
  const { inputValue, setInputValue, setStoredInputValue } = useInputContext();

  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full p-4 will-change-transform"
      onSelect={() => {
        setStoredInputValue(inputValue);
        setInputValue("");
        setSelectedFormSound({ sound: song, artworkUrl });
      }}
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
          {/* Bottom */}
          <div className="flex items-center text-xs gap-1 text-gray">
            <div className="line-clamp-1 font-medium">SONG</div>
            <div>&middot;</div>
            <div className="line-clamp-1">{song.attributes.artistName}</div>
          </div>
          {/* Top */}
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-black">
            {song.attributes.name}
          </div>
        </div>
      </div>
    </Command.Item>
  );
};
export default Song;
