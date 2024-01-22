import React, { useContext, useEffect, useState } from "react";
import { AlbumData, SongData } from "@/types/appleTypes";

// Form can either be for a song or an album. Interface sound can only be an
// album obviously

export type SoundContextType = {
  selectedSound: AlbumData | SongData | null;
  setSelectedSound: React.Dispatch<
    React.SetStateAction<AlbumData | SongData | null>
  >;
  selectedFormSound: AlbumData | SongData | null;
  setSelectedFormSound: React.Dispatch<
    React.SetStateAction<AlbumData | SongData | null>
  >;
  rank: number;
  setRank: React.Dispatch<React.SetStateAction<number>>;
  prevEssentialId: string;
  setPrevEssentialId: React.Dispatch<React.SetStateAction<string>>;
  playContent: (contentId: string, contentType: string) => void;
};

type SoundContextProviderProps = {
  children: React.ReactNode;
};

export const SoundContext = React.createContext<SoundContextType | undefined>(
  undefined,
);

// Export the hook
export const useSoundContext = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useAlbumDetails must be used within AlbumDetailsProvider");
  }
  return context;
};

export const SoundDetailsProvider = ({
  children,
}: SoundContextProviderProps) => {
  const [selectedSound, setSelectedSound] = useState<
    AlbumData | SongData | null
  >(null);

  const [selectedFormSound, setSelectedFormSound] = useState<
    AlbumData | SongData | null
  >(null);

  const [prevEssentialId, setPrevEssentialId] = useState("");
  const [rank, setRank] = useState(0);

  // Initialize MusicKit
  useEffect(() => {
    document.addEventListener("musickitloaded", () => {});
  }, []);

  const playContent = async (contentId: string, contentType: string) => {
    try {
      const music = MusicKit.getInstance();
      await music.authorize();

      const queueOptions =
        contentType === "songs" ? { song: contentId } : { album: contentId };
      await music.setQueue(queueOptions);
      await music.play();
    } catch (error) {
      console.error(`Error playing ${contentType}:`, error);
    }
  };

  return (
    <SoundContext.Provider
      value={{
        selectedSound,
        setSelectedSound,
        selectedFormSound,
        setSelectedFormSound,
        prevEssentialId,
        setPrevEssentialId,
        rank,
        setRank,
        playContent,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
