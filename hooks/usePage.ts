import { PageSound, useInterfaceContext } from "@/context/Interface";

import { Author } from "@/types/global";
import { DatabaseUserAttributes } from "@/lib/global/auth";
import { EntryExtended } from "@/types/global";

export const useEntry = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const openEntryPage = (entry: EntryExtended) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      { type: "entry", key: entry.id, data: entry, isOpen: false },
    ]);
    window.history.pushState(null, "");
  };

  return { openEntryPage };
};

export const useUser = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const openUserPage = (author: Author | DatabaseUserAttributes) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      { type: "user", key: author.id, data: author, isOpen: false },
    ]);
    window.history.pushState(null, "");
  };

  return { openUserPage };
};

export const useSound = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const openSoundPage = (sound: PageSound) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      { type: "sound", key: sound.id, data: sound, isOpen: false },
    ]);
    window.history.pushState(null, "");
  };

  return { openSoundPage };
};
