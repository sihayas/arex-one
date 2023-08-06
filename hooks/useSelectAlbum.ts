import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useDominantColor } from "@/hooks/npm/useDominantColor";
import { AlbumData } from "@/lib/interfaces";

export const useSelectAlbum = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, setHideSearch } = useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();

  // Set the album
  const handleSelectAlbum = async (
    imgElement: HTMLImageElement,
    album: AlbumData,
    artworkUrl: string
  ) => {
    const colors = await getDominantColor(imgElement);

    const extendedAlbum = {
      ...album,
      artworkUrl,
      colors,
    };

    setSelectedAlbum(extendedAlbum);
    setHideSearch(true);

    // Switch to album page and add to memory
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "album",
        album: extendedAlbum,
        dimensions: {
          width: 800,
          height: 800,
        },
      },
    ]);
  };

  return { handleSelectAlbum };
};
