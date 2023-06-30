import { useContext } from "react";
import {
  AlbumDetailsContext,
  AlbumDetailsContextType,
} from "../context/CMDKAlbum";

export const useAlbumDetails = (): AlbumDetailsContextType => {
  const context = useContext(AlbumDetailsContext);
  if (!context) {
    throw new Error("useAlbumDetails must be used within AlbumDetailsProvider");
  }
  return context;
};

export default useAlbumDetails;
