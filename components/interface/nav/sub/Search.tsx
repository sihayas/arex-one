import { AlbumData, SongData } from "@/lib/global/interfaces";

import { Command } from "cmdk";

import Song from "./items/Song";
import User from "./items/User";
import Album from "./items/Album";

interface SearchProps {
  searchData: any;
  isInitialLoading: boolean;
  isFetching: boolean;
  error: any;
}

const Search = ({
  searchData,
  isInitialLoading,
  isFetching,
  error,
}: SearchProps) => {
  if (isInitialLoading || isFetching)
    return <div className="absolute bottom-1/2 left-1/2 text-xs">loading</div>;

  if (!searchData) return null;

  const appleData = searchData?.appleData || {};
  const userData = searchData?.users || {};

  const filteredAlbums = appleData.filteredAlbums || [];
  const filteredSongs = appleData.filteredSongs || [];

  // Combining the different data types into a single array
  const allData = [
    ...filteredAlbums.map((album: AlbumData) => ({ ...album, type: "albums" })),
    ...filteredSongs.map((song: SongData) => ({ ...song, type: "songs" })),
    // ...userData.map((user: UserData) => ({ ...user, type: "users" })),
  ];

  return (
    <Command.List className="pb-96" tabIndex={-1}>
      {allData.map((item, index) => {
        switch (item.type) {
          case "albums":
            return <Album key={index} album={item} />;
          case "songs":
            return <Song key={index} song={item} />;
          case "users":
            return <User key={index} user={item} />;
          default:
            return null;
        }
      })}
    </Command.List>
  );
};

export default Search;
