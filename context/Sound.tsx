import React, { useContext, useState } from "react";
import { SelectedSound } from "../lib/global/interfaces";

export type SoundContextType = {
  selectedSound: SelectedSound | null;
  setSelectedSound: React.Dispatch<React.SetStateAction<SelectedSound | null>>;
  selectedFormSound: SelectedSound | null;
  setSelectedFormSound: React.Dispatch<
    React.SetStateAction<SelectedSound | null>
  >;
};

type SoundContextProviderProps = {
  children: React.ReactNode;
};

export const SoundContext = React.createContext<SoundContextType | undefined>(
  undefined
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
    null
  );

  const [selectedFormSound, setSelectedFormSound] =
    useState<SelectedSound | null>(null);

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
