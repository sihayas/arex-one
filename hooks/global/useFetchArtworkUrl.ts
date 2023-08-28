import { useQuery } from "@tanstack/react-query";
import { getAlbumById, getAlbumBySongId } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface FetchArtworkResult {
  artworkUrl: string | null;
  albumData: AlbumData | null;
  isLoading: boolean;
  type?: string;
}

export default function useFetchArtworkUrl(
  id: string | undefined, // This can be albumId or songId
  size: string,
  type: "albumId" | "songId" // Define the type as either "albumId" or "songId"
): FetchArtworkResult {
  const result = useQuery<AlbumData, Error>(
    [type, id],
    () => (type === "albumId" ? getAlbumById(id!) : getAlbumBySongId(id!)), // Based on type, call the appropriate function
    {
      enabled: !!id,
    }
  );

  let artworkUrl: string | null = null;
  let albumData: AlbumData | null = null;

  if (result.data && !result.isError) {
    albumData = result.data;
    const urlTemplate = albumData.attributes.artwork.url;
    artworkUrl = GenerateArtworkUrl(urlTemplate, size);
  }

  return {
    artworkUrl,
    albumData,
    isLoading: result.isLoading,
  };
}
