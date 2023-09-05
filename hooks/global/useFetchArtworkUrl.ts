import { useQuery } from "@tanstack/react-query";
import { getAlbumById, getAlbumBySongId } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface FetchArtworkResult {
  artworkUrl: string | null;
  albumData: AlbumData | null;
  isLoading: boolean;
}

export default function useFetchArtworkUrl(
  id: string | undefined,
  size: string,
  type: "albumId" | "songId"
): FetchArtworkResult {
  // Initialize Query
  const fetchFn = type === "albumId" ? getAlbumById : getAlbumBySongId;
  const result = useQuery<AlbumData, Error>([type, id], () => fetchFn(id!), {
    enabled: !!id,
  });

  // Initialize Return Variables
  let artworkUrl: string | null = null;
  let albumData: AlbumData | null = null;

  // Update Return Variables if Data is Available
  if (result.data && !result.isError) {
    albumData = result.data;
    artworkUrl = GenerateArtworkUrl(albumData.attributes.artwork.url, size);
  }

  return {
    artworkUrl,
    albumData,
    isLoading: result.isLoading,
  };
}
