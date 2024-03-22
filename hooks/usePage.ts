import { useInterfaceContext } from "@/context/InterfaceContext";

import { Artifact, UserType } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

export const useArtifact = () => {
  const { setPages, setIsVisible } = useInterfaceContext();

  const handleSelectArtifact = (artifact: Artifact, replyId?: string) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: artifact.id,
        name: "artifact",
        threadcrumbs: [artifact.id],
        scrollPosition: 0,
        artifact: {
          data: artifact,
          replyTo: replyId,
        },
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectArtifact };
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
