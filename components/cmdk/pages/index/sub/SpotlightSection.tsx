import { AlbumData } from "@/lib/global/interfaces";
import { useFetchSpotlightAlbums } from "@/lib/api/indexAPI";
import { SoundPreview } from "./SoundPreview";

const SpotlightSection = () => {
  const { spotlightAlbumsQuery, spotlightAlbumsDataQuery } =
    useFetchSpotlightAlbums(1);
  const isLoading =
    spotlightAlbumsQuery.isLoading || spotlightAlbumsDataQuery.isLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      {spotlightAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
        <SoundPreview key={album.id} album={album} index={index + 1} />
      ))}
    </div>
  );
};
export default SpotlightSection;
