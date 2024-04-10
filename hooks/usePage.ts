import { useInterfaceContext } from "@/context/Interface";

import { Entry, UserType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

export const useEntry = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectEntry = (entry: Entry, replyId?: string) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: entry.id,
        name: "entry",
        threadcrumbs: [entry.id],
        scrollPosition: 0,
        entry: {
          data: entry,
          replyTo: replyId,
        },
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectEntry };
};

export const useUser = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectUser = (author: UserType) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: author.id,
        name: "user",
        user: author,
        scrollPosition: 0,
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectUser };
};

export const useSound = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectSound = (sound: AlbumData | SongData) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: sound.id,
        name: "sound",
        sound: { data: sound },
        scrollPosition: 0,
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
