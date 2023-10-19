import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSound } from "@/context/SoundContext";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import { AlbumData, SongData } from "@/types/appleTypes";

import { v4 as uuidv4 } from "uuid";
import { Record, User } from "@/types/dbTypes";

// Handle RecordEntry Click
export const useHandleEntryClick = (record: Record) => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "entry",
        threadcrumbs: [record.id],
        dimensions: {
          width: 480,
          height: 1024,
        },
        scrollPosition: 0,
        entry: record,
      },
    ]);
    setThreadcrumbs([record.id]);
    window.history.pushState(null, "");
  };
};

// Handle User Click
export const useHandleUserClick = (author: User) => {
  const { setPages, setIsVisible } = useInterfaceContext();

  return () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "user",
        user: author,
        dimensions: { width: 576, height: 352 },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };
};

// Handle Sound Click
export const useHandleSoundClick = () => {
  // CMDK context
  const { setPages, setIsVisible, pages } = useInterfaceContext();
  const { setSelectedSound } = useSound();

  const handleSelectSound = async (
    sound: AlbumData | SongData,
    artworkUrl: string
  ) => {
    setSelectedSound({ sound: sound, artworkUrl });
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "album",
        sound: sound,
        dimensions: {
          width: 480,
          height: 1234,
        },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };

  return { handleSelectSound };
};
