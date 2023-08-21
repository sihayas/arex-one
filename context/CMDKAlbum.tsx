import React, { useContext, useState } from "react";
import { SelectedSound } from "../lib/global/interfaces";

export type AlbumDetailsContextType = {
  selectedSound: SelectedSound | null;
  setSelectedSound: React.Dispatch<React.SetStateAction<SelectedSound | null>>;
};

type AlbumDetailsProviderProps = {
  children: React.ReactNode;
};

export const AlbumDetailsContext = React.createContext<
  AlbumDetailsContextType | undefined
>(undefined);

// Export the hook
export const useCMDKAlbum = (): AlbumDetailsContextType => {
  const context = useContext(AlbumDetailsContext);
  if (!context) {
    throw new Error("useAlbumDetails must be used within AlbumDetailsProvider");
  }
  return context;
};

export const AlbumDetailsProvider = ({
  children,
}: AlbumDetailsProviderProps) => {
  const [selectedSound, setSelectedSound] = useState<SelectedSound | null>(
    null
  );

  return (
    <AlbumDetailsContext.Provider
      value={{
        selectedSound,
        setSelectedSound,
      }}
    >
      {children}
    </AlbumDetailsContext.Provider>
  );
};
