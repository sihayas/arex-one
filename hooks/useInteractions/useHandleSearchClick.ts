import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";
import { useInterfaceContext } from "@/context/InterfaceContext";

export const useHandleSearchClick = () => {
  const { getDominantColor } = useDominantColor();
  const { setInputValue, setStoredInputValue, inputValue } =
    useInterfaceContext();

  const { setSelectedFormSound } = useSound();

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
