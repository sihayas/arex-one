import React, { useState } from "react";
import { AlbumData } from "../lib/interfaces";

export type AlbumDetailsContextType = {
  selectedAlbum: AlbumData | null;
  setSelectedAlbum: React.Dispatch<React.SetStateAction<AlbumData | null>>;
  artworkUrl: string;
  setArtworkUrl: React.Dispatch<React.SetStateAction<string>>;
  shadowColor: string;
  setShadowColor: React.Dispatch<React.SetStateAction<string>>;
};

export const AlbumDetailsContext = React.createContext<
  AlbumDetailsContextType | undefined
>(undefined);

export const AlbumDetailsProvider = ({ children }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [artworkUrl, setArtworkUrl] = useState("");
  const [shadowColor, setShadowColor] = useState("");

  return (
    <AlbumDetailsContext.Provider
      value={{
        selectedAlbum,
        setSelectedAlbum,
        artworkUrl,
        setArtworkUrl,
        shadowColor,
        setShadowColor,
      }}
    >
      {children}
    </AlbumDetailsContext.Provider>
  );
};
