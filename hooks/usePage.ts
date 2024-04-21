import { useInterfaceContext } from "@/context/Interface";

import { AlbumData } from "@/types/appleTypes";
import { Author } from "@/types/global";
import { DatabaseUserAttributes } from "@/lib/global/auth";
import { EntryExtended } from "@/types/global";

export const useEntry = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectEntry = (entry: EntryExtended) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      { key: entry.id, type: "entry", data: entry, isOpen: false },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectEntry };
};

export const useUser = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectUser = (author: Author | DatabaseUserAttributes) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      { key: author.id, type: "user", data: author, isOpen: false },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectUser };
};

export const useSound = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectSound = (sound: AlbumData) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: sound.id,
        type: "sound",
        data: sound,
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
