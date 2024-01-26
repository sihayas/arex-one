import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSoundContext } from "@/context/SoundContext";
import { AlbumData, SongData } from "@/types/appleTypes";

import { v4 as uuidv4 } from "uuid";
import { Artifact, UserType } from "@/types/dbTypes";

export const useArtifact = (artifact: Artifact) => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setThreadcrumbs } = useThreadcrumb();

  return () => {
    setIsVisible(true);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "artifact",
        threadcrumbs: [artifact.id],
        dimensions: {
          width: 528,
          height: 400,
        },
        scrollPosition: 0,
        artifact: artifact,
        color: artifact.appleData.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setThreadcrumbs([artifact.id]);
    window.history.pushState(null, "");
  };
};

export const useUser = (author: UserType) => {
  const { setPages, setIsVisible } = useInterfaceContext();

  return () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "user",
        user: author,
        dimensions: { width: 688, height: 688 },
        scrollPosition: 0,
        color: "CCC",
        isOpen: false,
      },
    ]);
    setIsVisible(true);
  };
};

export const useSound = () => {
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSoundContext();

  const handleSelectSound = (sound: AlbumData | SongData) => {
    setSelectedSound(sound);
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "album",
        sound: sound,
        dimensions: {
          width: 432,
          height: 432,
        },
        scrollPosition: 0,
        color: sound.attributes.artwork.bgColor,
        isOpen: false,
      },
    ]);
    setIsVisible(true);
  };

  return { handleSelectSound };
};
