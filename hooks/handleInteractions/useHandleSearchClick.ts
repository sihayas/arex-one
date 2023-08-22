import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { useCMDK } from "@/context/CMDKContext";

import { AlbumData, SongData } from "@/lib/global/interfaces";

export const useHandleSearchClick = () => {
  const { getDominantColor } = useDominantColor();
  const { setInputValue, setStoredInputValue, inputValue } = useCMDK();

  const { setSelectedSound } = useCMDKAlbum();

  const handleSelectSearch = async (
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
    setStoredInputValue(inputValue);
    setInputValue("");
  };

  return { handleSelectSearch };
};
