import React, { useContext, useState } from "react";
import { AlbumData } from "../lib/global/interfaces";

export type AlbumDetailsContextType = {
  selectedAlbum: AlbumData | null;
  setSelectedAlbum: React.Dispatch<React.SetStateAction<AlbumData | null>>;
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
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  return (
    <AlbumDetailsContext.Provider
      value={{
        selectedAlbum,
        setSelectedAlbum,
      }}
    >
      {children}
    </AlbumDetailsContext.Provider>
  );
};
