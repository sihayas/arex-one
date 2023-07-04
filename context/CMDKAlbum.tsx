import React, { useState } from "react";
import { AlbumData } from "../lib/interfaces";

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
