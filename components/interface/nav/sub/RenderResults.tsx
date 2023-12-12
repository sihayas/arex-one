import { AlbumData, SongData } from "@/types/appleTypes";

import { Command } from "cmdk";

import UserItem from "./items/User";
import Sound from "./items/Sound";
import { UserType } from "@/types/dbTypes";

interface SearchProps {
  searchData: any;
  isInitialLoading: boolean;
  isFetching: boolean;
  error: any;
}

const RenderResults = ({
  searchData,
  isInitialLoading,
  isFetching,
  error,
}: SearchProps) => {
  if (isInitialLoading || isFetching)
    return <div className="absolute bottom-1/2 left-1/2 text-xs"></div>;

  if (!searchData) return null;

  const appleData = searchData?.appleData || {};
  const userData = Array.isArray(searchData?.users) ? searchData.users : [];

  const filteredAlbums = appleData.filteredAlbums || [];
  const filteredSongs = appleData.filteredSongs || [];

  // Combining the different data types into a single array
  const allData = [
    ...filteredAlbums.map((album: AlbumData) => ({ ...album, type: "albums" })),
    ...filteredSongs.map((song: SongData) => ({ ...song, type: "songs" })),
    ...userData.map((user: UserType) => ({ ...user, type: "users" })),
  ];

  return (
    <>
      <Command.List tabIndex={-1}>
        {allData.map((item, index) => {
          switch (item.type) {
            case "albums":
            case "songs":
              return <Sound key={index} sound={item} />;
            case "users":
              return <UserItem key={index} user={item} />;
            default:
              return null;
          }
        })}
      </Command.List>
    </>
  );
};

export default RenderResults;
