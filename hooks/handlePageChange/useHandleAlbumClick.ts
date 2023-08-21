import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData } from "@/lib/global/interfaces";

export const useHandleAlbumClick = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, setHideSearch } = useCMDK();
  const { setSelectedSound } = useCMDKAlbum();

  // Set the album
  const handleSelectAlbum = async (
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

  return { handleSelectAlbum };
};
