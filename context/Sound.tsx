import React, { useContext, useState } from "react";
import { AlbumData, SongData } from "@/types/appleTypes";

interface SelectedSound {
  sound: AlbumData | SongData;
  artworkUrl: string;
}

interface SelectedFormSound {
  sound: AlbumData | SongData;
  artworkUrl: string;
}

// Form can either be for a song or an album. Interface sound can only be an
// album obviously

export type SoundContextType = {
  selectedSound: SelectedSound | null;
  setSelectedSound: React.Dispatch<React.SetStateAction<SelectedSound | null>>;
  selectedFormSound: SelectedFormSound | null;
  setSelectedFormSound: React.Dispatch<
    React.SetStateAction<SelectedFormSound | null>
  >;
};

type SoundContextProviderProps = {
  children: React.ReactNode;
};

export const SoundContext = React.createContext<SoundContextType | undefined>(
  undefined,
);

// Export the hook
export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useAlbumDetails must be used within AlbumDetailsProvider");
  }
  return context;
};

export const SoundDetailsProvider = ({
  children,
}: SoundContextProviderProps) => {
  const [selectedSound, setSelectedSound] = useState<SelectedSound | null>(
    null,
  );

  const [selectedFormSound, setSelectedFormSound] =
    useState<SelectedFormSound | null>(null);

  return (
    <SoundContext.Provider
      value={{
        selectedSound,
        setSelectedSound,
        selectedFormSound,
        setSelectedFormSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
