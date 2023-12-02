import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useSoundContext } from "@/context/SoundContext";
import { AlbumData, SongData } from "@/types/appleTypes";

import { v4 as uuidv4 } from "uuid";
import { Artifact, UserType } from "@/types/dbTypes";

// Handle RecordFeed Click
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
          width: 432,
          height: 832,
        },
        scrollPosition: 0,
        artifact: artifact,
      },
    ]);
    setThreadcrumbs([artifact.id]);
    window.history.pushState(null, "");
  };
};

// Handle User Click
export const useUser = (author: UserType) => {
  const { setPages, setIsVisible } = useInterfaceContext();

  return () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "user",
        user: author,
        dimensions: { width: 576, height: 346 },
        scrollPosition: 0,
      },
    ]);
    setIsVisible(true);
  };
};

// Handle Sound Click
export const useSound = () => {
  // CMDK context
  const { setPages, setIsVisible } = useInterfaceContext();
  const { setSelectedSound } = useSoundContext();

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
