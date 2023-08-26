import { useCMDKAlbum } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/Interface";

export const useHandleSearchClick = () => {
  const { getDominantColor } = useDominantColor();
  const { setInputValue, setStoredInputValue, inputValue } = useCMDK();

  const { setSelectedFormSound } = useCMDKAlbum();

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

    setSelectedFormSound(selectedSound);
    setStoredInputValue(inputValue);
    setInputValue("");
  };

  return { handleSelectSearch };
};
