import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";
import { v4 as uuidv4 } from "uuid";

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
        key: uuidv4(),
        name: "album",
        sound: selectedSound,
        dimensions: {
          width: 576,
          height: 576,
        },
        scrollPosition: 0,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
