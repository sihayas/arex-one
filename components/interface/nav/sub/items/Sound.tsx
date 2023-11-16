import Image from "next/image";
import { Command } from "cmdk";
import { AlbumData, SongData } from "@/types/appleTypes";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
// Importing context hooks
import { useSound } from "@/context/SoundContext";
import { useNavContext } from "@/context/NavContext";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
// Importing function to change essential
import { changeEssential } from "@/lib/apiHandlers/userAPI";
import { useUser } from "@supabase/auth-helpers-react";

// Component to handle sound
const Sound = ({ sound }: { sound: AlbumData | SongData }) => {
  const user = useUser();
  const artworkUrl = GenerateArtworkUrl(sound.attributes.artwork.url, "1200");
  const { handleSelectSound } = useHandleSoundClick();
  const { prevEssentialId, setPrevEssentialId, rank, setRank } = useSound();
  const {
    inputValue,
    setInputValue,
    setStoredInputValue,
    isChangingEssential,
    setExpandInput,
  } = useNavContext();

  // Determine sound type
  const soundType = sound.type === "albums" ? "ALBUM" : "SONG";
  const artistName = sound.type === "songs" ? sound.attributes.artistName : "";

  const onSelect = async (appleId: string) => {
    // If essential is being changed and user exists
    if (
      isChangingEssential &&
      user &&
      prevEssentialId &&
      soundType === "ALBUM"
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
      await handleSelectSound(sound, artworkUrl);
      setExpandInput(false);
      setInputValue("");
    }
  };

  // Render command item
  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full pb-8 will-change-transform"
      onSelect={() => onSelect(sound.id)}
    >
      <div className="flex w-full items-center gap-4">
        <Image
          id={sound.id}
          className="rounded-xl shadow-shadowKitLow"
          src={artworkUrl}
          alt={`${sound.attributes.name} artwork`}
          width={48}
          height={48}
          draggable="false"
        />

        <div className="flex flex-col justify-center overflow-hidden">
          <div className="flex items-center text-xs gap-[6px] text-gray">
            <div className="font-medium">{soundType}</div>
            {artistName && (
              <>
                <div>&middot;</div>
                <div className="line-clamp-1">{artistName}</div>
              </>
            )}
          </div>
          <div className="text-sm text-black line-clamp-1">
            {sound.attributes.name}
          </div>
        </div>
      </div>
    </Command.Item>
  );
};

// Export Sound component
export default Sound;
