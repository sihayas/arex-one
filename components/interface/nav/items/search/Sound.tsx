import Image from "next/image";
import { Command } from "cmdk";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useNavContext } from "@/context/Nav";
import { useInterfaceContext } from "@/context/Interface";

const Sound = ({ sound }: { sound: AlbumData | SongData }) => {
  const { user } = useInterfaceContext();

  const {
    setInputValue,
    isChangingEssential,
    setStoredInputValue,
    inputValue,
    setSelectedFormSound,
  } = useNavContext();

  const soundType = sound.type;

  const artwork = sound.attributes.artwork.url
    .replace("{w}", "95")
    .replace("{h}", "95");

  const artistName = sound.attributes.artistName;

  const song = soundType === "songs" ? (sound as SongData) : null;

  const onSelect = async (appleId: string) => {
    // If essential is being changed and user exists
    if (isChangingEssential && user && soundType === "albums") {
      // Change essential
      // const response = await changeEssential(
      //   user.id,
      //   prevEssentialId,
      //   appleId,
      //   rank,
      // );
      // If response is successful, reset values
      // if (response.status === 200) {
      //   setPrevEssentialId("");
      //   setInputValue("");
      //   setRank(0);
      // }
    } else {
      // If not changing essential, store input value and prepare form
      setSelectedFormSound(sound);
      setStoredInputValue(inputValue);
      setInputValue("");
    }
  };

  // Render command item
  return (
    <Command.Item
      value={sound.id}
      onMouseDown={(e) => e.preventDefault()}
      className="z-10 flex w-full items-center gap-4 p-4 will-change-transform"
      onSelect={() => onSelect(sound.id)}
    >
      <Image
        id={sound.id}
        className="shadow-shadowKitLow rounded-lg"
        src={artwork}
        alt={`${sound.attributes.name} artwork`}
        width={38}
        height={38}
        draggable="false"
      />

      <div className="flex flex-col justify-center overflow-hidden">
        <div className="text-gray flex items-center gap-1 text-sm">
          <div className={`line-clamp-1`}>{artistName}</div>
          {song && (
            <>
              <div>&middot;</div>
              <div className="line-clamp-1">{song.attributes.albumName}</div>
            </>
          )}
        </div>
        <div className="line-clamp-1 text-base font-medium text-black">
          {sound.attributes.name}
        </div>
      </div>
    </Command.Item>
  );
};

export default Sound;
