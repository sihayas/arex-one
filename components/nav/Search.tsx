import Image from "next/image";
import { useHandleAlbumClick } from "@/hooks/handlePageChange/useHandleAlbumClick";
import { AlbumData } from "@/lib/global/interfaces";
import generateArtworkUrl from "../global/GenerateArtworkUrl";

interface SearchProps {
  searchData: any;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
}

const Search = ({ searchData, isLoading, isFetching, error }: SearchProps) => {
  const { handleSelectAlbum } = useHandleAlbumClick();

  if (isLoading && isFetching) if (error) return <div>Error</div>;

  return (
    <div className="pb-96">
      {searchData?.filteredAlbums?.map((album: AlbumData) => {
        const artworkUrl = generateArtworkUrl(
          album.attributes.artwork.url,
          "90"
        );
        return (
          <div
            className="w-full p-4 hoverable-medium border-b border-silver"
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
                id={album.id}
                className="rounded-lg shadow-index"
                src={artworkUrl}
                alt={`${album.attributes.name} artwork`}
                width={36}
                height={36}
                draggable="false"
              />

              {/* <Rating color={shadowColors[album.id]} rating={averageRating} /> */}

              <div className="flex flex-col justify-center gap">
                <div className="text-sm font-medium text-black max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
                  {album.attributes.name}
                </div>
                <div className="flex gap-[6px] items-center text-gray text-xs line-clamp-1">
                  <div className="">{album.attributes.artistName}</div>
                  <div className="">&middot;</div>
                  <div className="">
                    {album.attributes.releaseDate.split("-")[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Search;
