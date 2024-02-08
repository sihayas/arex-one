import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSoundContext } from "@/context/SoundContext";
import { AlbumData, SongData } from "@/types/appleTypes";

import { Artifact, UserType } from "@/types/dbTypes";

export const useArtifact = () => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

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
          artifact,
          replyId,
        },
        color: artifact.appleData.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setThreadcrumbs([artifact.id]);
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
        color: "CCC",
        isOpen: false,
      },
    ]);
    window.history.pushState(null, "");
  };

  return { handleSelectUser };
};

export const useSound = () => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSoundContext();

  const handleSelectSound = (sound: AlbumData | SongData) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: sound.id,
        name: "sound",
        sound: { sound },
        scrollPosition: 0,
        color: sound.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setSelectedSound(sound);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
