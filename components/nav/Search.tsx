import Image from "next/image";
import { useSelectAlbum } from "@/hooks/global/useSelectAlbum";
import { AlbumData } from "@/lib/global/interfaces";
import { generateArtworkUrl } from "../generics";

interface SearchProps {
  searchData: any;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
}

const Search = ({ searchData, isLoading, isFetching, error }: SearchProps) => {
  const { handleSelectAlbum } = useSelectAlbum();

  if (isLoading && isFetching) if (error) return <div>Error</div>;

  return (
    <>
      {/* Search Results */}
      {searchData.map((album: AlbumData, averageRating: string) => {
        const artworkUrl = generateArtworkUrl(
          album.attributes.artwork.url,
          "160"
        );
        return (
          <div
            className="w-full p-3 hoverable-medium"
            key={album.id}
            onClick={() =>
              handleSelectAlbum(
                document.getElementById(album.id) as HTMLImageElement,
                album,
                artworkUrl
              )
            }
            onMouseDown={(event) => event.preventDefault()}
          >
            <div className="flex gap-4 items-center w-full">
              <Image
                id={album.id} // Add an id attribute to identify the image later
                className="rounded-lg border border-silver "
                src={artworkUrl}
                alt={`${album.attributes.name} artwork`}
                width={80}
                height={80}
                draggable="false"
              />

              {/* <Rating color={shadowColors[album.id]} rating={averageRating} /> */}

              <div className="flex flex-col justify-center gap-1">
                <div className="text-sm text-white max-w-[17rem] text-ellipsis overflow-hidden whitespace-nowrap">
                  {album.attributes.name}
                </div>
                <div className="text-xs text-white">
                  {album.attributes.artistName}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Search;
