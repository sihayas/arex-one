import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/lib/global/interfaces";
import { v4 as uuidv4 } from "uuid";

// Handle Entry Click
export const useHandleEntryClick = (reviewId: string) => {
  const { setPages } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

  const handleEntryClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "entry",
        threadcrumbs: [reviewId],
        dimensions: {
          width: 576,
          height: 576,
        },
        scrollPosition: 0,
      },
    ]);
    setThreadcrumbs([reviewId]);
    window.history.pushState(null, "");
  };

  return handleEntryClick;
};

// Handle User Click
export const useHandleUserClick = (authorId: string) => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleUserClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: authorId,
        name: "user",
        user: authorId,
        dimensions: { width: 384, height: 512 },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };

  return handleUserClick;
};

// Handle Sound Click
export const useHandleSoundClick = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, pages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSound();

  const handleSelectSound = async (
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

    setSelectedSound(selectedSound);

    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "album",
        sound: selectedSound,
        dimensions: {
          width: 544,
          height: 928,
        },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };

  return { handleSelectSound };
};
