import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";
import { useInputContext } from "@/context/InputContext";

export const useHandleSearchClick = () => {
  const { getDominantColor } = useDominantColor();
  const { setInputValue, setStoredInputValue, inputValue } = useInputContext();

  const { setSelectedFormSound } = useSound();

  const handleSelectSearch = async (
    imgElement: HTMLImageElement,
    sound: AlbumData | SongData,
    artworkUrl: string,
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
