import { Command } from "cmdk";
import ColorThief from "colorthief";
import Image from "next/image";
import { useState } from "react";
import Rating from "./subcomponents/Rating";
import useCMDKContext from "../../../../hooks/useCMDK";
import useCMDKAlbum from "../../../../hooks/useCMDKAlbum";
import { AlbumData } from "@/lib/interfaces";

interface SearchProps {
  searchData: any;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
}

const Search = ({ searchData, isLoading, isFetching, error }: SearchProps) => {
  const [shadowColors, setShadowColors] = useState<{ [key: string]: string }>(
    {}
  );

  // CMDK context
  const { setPages, bounce, setHideSearch } = useCMDKContext();
  const { setSelectedAlbum } = useCMDKAlbum();

  // Dominant color thief
  const handleImageLoad = async (
    imgElement: HTMLImageElement,
    album: AlbumData
  ) => {
    const dominantColor = new ColorThief().getColor(imgElement);
    setShadowColors((prev) => ({
      ...prev,
      [album.id]: `rgba(${dominantColor.join(",")}`,
    }));
    return generateArtworkUrl(album.attributes.artwork.url);
  };

  //Set the album
  const handleSelectAlbum = (
    album: AlbumData,
    artworkUrl: string,
    shadowColor: string
  ) => {
    const extendedAlbum = {
      ...album,
      artworkUrl,
      shadowColor,
    };
    setSelectedAlbum(extendedAlbum);
    setHideSearch(true);
    // Switch to album page and add to memory
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "album",
        album: {
          ...album,
          artworkUrl,
          shadowColor,
        },
      },
    ]);
    bounce();
  };

  //Test ratings average
  const handleUpdateRatingsClick = async () => {
    const response = await fetch("/api/testUpdateAlbumRating", {
      method: "POST",
    });
    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  };

  if (isLoading && isFetching) if (error) return <div>Error</div>;
  searchData && searchData.length ? null : <div></div>;

  return (
    <div className="flex flex-col h-full p-4 w-full overflow-scroll items-start gap-2 rounded-[14px] rounded-t-none">
      {/* Test Average Rating */}
      <button
        className="absolute bottom-0 right-0 text-xs text-grey"
        onClick={handleUpdateRatingsClick}
      >
        Update Album Ratings
      </button>
      {/* Search Results */}
      {searchData.map((album: AlbumData, averageRating: string) => {
        const artworkUrl = generateArtworkUrl(album.attributes.artwork.url);
        return (
          <Command.Item
            className="w-full p-2"
            key={album.id}
            onSelect={() =>
              // Set selected album state
              handleSelectAlbum(album, artworkUrl, shadowColors[album.id])
            }
          >
            <div className="flex gap-4 items-center w-full">
              <Image
                className="rounded-2xl shadow-defaultLow"
                src={artworkUrl}
                alt={`${album.attributes.name} artwork`}
                width={80}
                height={80}
                onLoad={(event) =>
                  handleImageLoad(event.target as HTMLImageElement, album)
                }
              />

              <Rating color={shadowColors[album.id]} rating={averageRating} />

              <div className="flex flex-col justify-center gap-1">
                <div className="text-sm text-greyTitle max-w-[17rem] text-ellipsis overflow-hidden whitespace-nowrap">
                  {album.attributes.name}
                </div>
                <div className="text-xs text-grey">
                  {album.attributes.artistName}
                </div>
              </div>
            </div>
          </Command.Item>
        );
      })}
    </div>
  );
};

export default Search;

const generateArtworkUrl = (urlTemplate: String) => {
  return urlTemplate.replace("{w}", "2500").replace("{h}", "2500");
};
