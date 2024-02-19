import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSoundContext } from "@/context/SoundContext";

import { Artifact, Sound, UserType } from "@/types/dbTypes";

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
          replyTo: replyId,
        },
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

  const handleSelectSound = (sound: Sound) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: sound.id,
        name: "sound",
        sound: { sound },
        scrollPosition: 0,
        isOpen: false,
      },
    ]);
    setSelectedSound(sound.appleData);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
