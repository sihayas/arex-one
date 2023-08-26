import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";

export const useHandleSoundClick = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages } = useInterface();
  const { setSelectedSound } = useSound();

  // Set the album
  const handleSelectSound = async (
    imgElement: HTMLImageElement,
    sound: AlbumData | SongData,
    artworkUrl: string
  ) => {
    const colors = getDominantColor(imgElement);

    const selectedSound = {
      sound: sound,
      artworkUrl,
      colors,
    };

    setSelectedSound(selectedSound);

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
        scrollPosition: 0,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
