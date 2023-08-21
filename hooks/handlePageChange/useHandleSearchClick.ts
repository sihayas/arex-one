import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData } from "@/lib/global/interfaces";

export const useHandleSearchClick = () => {
  const { getDominantColor } = useDominantColor();

  const { setSelectedSound } = useCMDKAlbum();

  const handleSearchClick = async (
    imgElement: HTMLImageElement,
    album: AlbumData,
    artworkUrl: string
  ) => {
    const colors = getDominantColor(imgElement);

    const selectedSound = {
      sound: album,
      artworkUrl,
      colors,
    };

    setSelectedSound(selectedSound);
    console.log("selectedSound", selectedSound);
  };

  return { handleSearchClick };
};
