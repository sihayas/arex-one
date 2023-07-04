import React, { useState } from "react";
import { AlbumDataExtended } from "../lib/interfaces";

export type AlbumDetailsContextType = {
  selectedAlbum: AlbumDataExtended | null;
  setSelectedAlbum: React.Dispatch<
    React.SetStateAction<AlbumDataExtended | null>
  >;
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
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDataExtended | null>(
    null
  );

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
