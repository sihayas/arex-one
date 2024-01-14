import Image from "next/image";
import { Command } from "cmdk";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useSoundContext } from "@/context/SoundContext";
import { useNavContext } from "@/context/NavContext";
import { useSound } from "@/hooks/usePage";
import { changeEssential } from "@/lib/apiHelper/user";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Sound = ({ sound }: { sound: AlbumData | SongData }) => {
  const { user } = useInterfaceContext();

  const { handleSelectSound } = useSound();
  const {
    prevEssentialId,
    setPrevEssentialId,
    rank,
    setRank,
    setSelectedFormSound,
  } = useSoundContext();
  const {
    setInputValue,
    isChangingEssential,
    setStoredInputValue,
    inputValue,
  } = useNavContext();

  const soundType = sound.type;

  const artwork = sound.attributes.artwork.url
    .replace("{w}", "720")
    .replace("{h}", "720");

  const artistName = sound.attributes.artistName;

  const song = soundType === "songs" ? (sound as SongData) : null;

  const onSelect = async (appleId: string) => {
    // If essential is being changed and user exists
    if (
      isChangingEssential &&
      user &&
      prevEssentialId &&
      soundType === "albums"
    ) {
      // Change essential
      const response = await changeEssential(
        user.id,
        prevEssentialId,
        appleId,
        rank,
      );
      // If response is successful, reset values
      if (response.status === 200) {
        setPrevEssentialId("");
        setInputValue("");
        setRank(0);
      }
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
      className="w-full p-4 will-change-transform flex w-full items-center gap-4 z-10"
      onSelect={() => onSelect(sound.id)}
    >
      <Image
        id={sound.id}
        className="rounded-lg border border-silver"
        src={artwork}
        alt={`${sound.attributes.name} artwork`}
        width={38}
        height={38}
        draggable="false"
      />

      <div className="flex flex-col justify-center overflow-hidden">
        <div className="flex items-center text-sm gap-1 text-gray">
          <div className={`line-clamp-1`}>{artistName}</div>
          {song && (
            <>
              <div>&middot;</div>
              <div className="line-clamp-1">{song.attributes.albumName}</div>
            </>
          )}
        </div>
        <div className="text-base text-black line-clamp-1 font-medium">
          {sound.attributes.name}
        </div>
      </div>
    </Command.Item>
  );
};

// Export Sound component
export default Sound;
