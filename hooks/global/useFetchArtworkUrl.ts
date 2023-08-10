import { useQuery } from "@tanstack/react-query";
import { getAlbumById } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import { generateArtworkUrl } from "@/components/cmdk/generics";

interface FetchArtworkResult {
  artworkUrl: string | null;
  albumData: AlbumData | null;
  isLoading: boolean;
}

export default function useFetchArtworkUrl(
  albumId: string | undefined,
  size: string
): FetchArtworkResult {
  const result = useQuery<AlbumData, Error>(
    ["albumData", albumId],
    () => getAlbumById(albumId!),
    {
      enabled: !!albumId,
    }
  );

  let artworkUrl: string | null = null;
  let albumData: AlbumData | null = null;

  if (result.data && !result.isError) {
    albumData = result.data;
    const urlTemplate = albumData.attributes.artwork.url;
    artworkUrl = generateArtworkUrl(urlTemplate, size);
  }

  return {
    artworkUrl,
    albumData,
    isLoading: result.isLoading,
  };
}
