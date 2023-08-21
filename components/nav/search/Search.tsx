import { AlbumData, SongData, UserData } from "@/lib/global/interfaces";

import { Command } from "cmdk";

import Song from "./sections/Song";
import User from "./sections/User";
import Album from "./sections/Album";

interface SearchProps {
  searchData: any;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
}

const Search = ({ searchData, isLoading, isFetching, error }: SearchProps) => {
  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const appleData = searchData?.appleData || {};
  const userData = searchData?.userData || {};

  const filteredAlbums = appleData.filteredAlbums || [];
  const filteredSongs = appleData.filteredSongs || [];
  const users = userData.users || [];

  // Combining the different data types into a single array
  const allData = [
    ...filteredAlbums.map((album: AlbumData) => ({ ...album, type: "albums" })),
    ...filteredSongs.map((song: SongData) => ({ ...song, type: "songs" })),
    ...users.map((user: UserData) => ({ ...user, type: "users" })),
  ];

  console.log(allData);

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
