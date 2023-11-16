import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSound } from "@/context/SoundContext";
import { AlbumData, SongData } from "@/types/appleTypes";

import { v4 as uuidv4 } from "uuid";
import { Record, User } from "@/types/dbTypes";

// Handle FeedRecord Click
export const useHandleRecordClick = (record: Record) => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "record",
        threadcrumbs: [record.id],
        dimensions: {
          width: 432,
          height: 832,
        },
        scrollPosition: 0,
        record: record,
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
        dimensions: { width: 352, height: 576 },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };
};

// Handle Sound Click
export const useHandleSoundClick = () => {
  // CMDK context
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSound();

  const handleSelectSound = async (
    sound: AlbumData | SongData,
    artworkUrl: string,
  ) => {
    setSelectedSound({ sound: sound, artworkUrl });
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "album",
        sound: { sound: sound, artworkUrl },
        dimensions: {
          width: 480,
          height: 832,
        },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };

  return { handleSelectSound };
};
