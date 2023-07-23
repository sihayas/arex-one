// hooks/useSelectAlbum.js
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/useDominantColor";
import { AlbumData } from "@/lib/interfaces";

export const useSelectAlbum = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, bounce, setHideSearch } = useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();

  // Set the album
  const handleSelectAlbum = async (
    imgElement: HTMLImageElement,
    album: AlbumData,
    artworkUrl: string
  ) => {
    const shadowColor = await getDominantColor(imgElement);

    const extendedAlbum = {
      ...album,
      artworkUrl,
      shadowColor,
    };
    setSelectedAlbum(extendedAlbum);
    setHideSearch(true);
    // Switch to album page and add to memory
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "album",
        album: {
          ...album,
          artworkUrl,
          shadowColor,
        },
      },
    ]);
    bounce();
  };

  return { handleSelectAlbum };
};
