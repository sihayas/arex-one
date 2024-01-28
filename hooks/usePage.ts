import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSoundContext } from "@/context/SoundContext";
import { AlbumData, SongData } from "@/types/appleTypes";

import { Artifact, UserType } from "@/types/dbTypes";

export const useArtifact = (artifact: Artifact) => {
  const { setPages, setIsVisible, scrollContainerRef } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();
  const sound = artifact.appleData;

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "artifact",
        threadcrumbs: [artifact.id],
        scrollPosition: 0,
        artifact: artifact,
        color: sound.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setThreadcrumbs([artifact.id]);
    scrollContainerRef.current?.scrollTo(0, 0);
    window.history.pushState(null, "");
  };
};

export const useUser = (author: UserType) => {
  const { setPages, setIsVisible, scrollContainerRef } = useInterfaceContext();

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "user",
        user: author,
        scrollPosition: 0,
        color: "CCC",
        isOpen: false,
      },
    ]);
    scrollContainerRef.current?.scrollTo(0, 0);
    window.history.pushState(null, "");
  };
};

export const useSound = () => {
  const { setPages, setIsVisible, scrollContainerRef } = useInterfaceContext();
  const { setSelectedSound } = useSoundContext();

  const handleSelectSound = (sound: AlbumData | SongData) => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "sound",
        sound: { sound },
        scrollPosition: 0,
        color: sound.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setSelectedSound(sound);
    scrollContainerRef.current?.scrollTo(0, 0);
    window.history.pushState(null, "");
  };

  return { handleSelectSound };
};
