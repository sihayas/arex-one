import { AlbumData } from "@/lib/global/interfaces";
import { useFetchBloomingAlbums } from "@/lib/api/indexAPI";
import { SoundPreview } from "./SoundPreview";

const BloomingSection = () => {
  const { bloomingAlbumsQuery, bloomingAlbumsDataQuery } =
    useFetchBloomingAlbums(1);
  const isLoading =
    bloomingAlbumsQuery.isLoading || bloomingAlbumsDataQuery.isLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      {bloomingAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
        <SoundPreview key={album.id} album={album} index={index + 1} />
      ))}
    </div>
  );
};

export default BloomingSection;
