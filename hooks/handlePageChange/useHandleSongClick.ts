import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { SongData } from "@/lib/global/interfaces";

export const useHandleSongClick = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, setHideSearch } = useCMDK();
  const { setSelectedSound } = useCMDKAlbum();

  // Set the album
  const handleSelectSong = async (
    imgElement: HTMLImageElement,
    song: SongData,
    artworkUrl: string
  ) => {
    const colors = getDominantColor(imgElement);

    const selectedSound = {
      sound: song,
      artworkUrl,
      colors,
    };

    setSelectedSound(selectedSound);
    setHideSearch(true);

    // Switch to album page and add to memory
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "album",
        sound: selectedSound,
        dimensions: {
          width: 658,
          height: 658,
        },
      },
    ]);
    console.log("selectedSound", selectedSound);
    window.history.pushState(null, "");
  };

  return { handleSelectSong };
};
