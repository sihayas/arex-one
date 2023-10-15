import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSound } from "@/context/Sound";
import { useDominantColor } from "@/hooks/global/useDominantColor";
import {
  AlbumData,
  ReviewData,
  SongData,
  UserData,
} from "@/lib/global/interfaces";
import { v4 as uuidv4 } from "uuid";

// Handle FeedEntry Click
export const useHandleEntryClick = (review: ReviewData) => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "entry",
        threadcrumbs: [review.id],
        dimensions: {
          width: 480,
          height: 1024,
        },
        scrollPosition: 0,
        entry: review,
      },
    ]);
    setThreadcrumbs([review.id]);
    window.history.pushState(null, "");
  };
};

// Handle User Click
export const useHandleUserClick = (author: UserData) => {
  const { setPages, setIsVisible } = useInterfaceContext();

  return () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "user",
        user: author,
        dimensions: { width: 352, height: 512 },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };
};

// Handle Sound Click
export const useHandleSoundClick = () => {
  const { getDominantColor } = useDominantColor();

  // CMDK context
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSound();

  const handleSelectSound = async (
    imgElement: HTMLImageElement,
    sound: AlbumData,
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
