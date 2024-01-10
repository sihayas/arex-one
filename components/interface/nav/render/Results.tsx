import { AlbumData, SongData } from "@/types/appleTypes";

import { Command, useCommandState } from "cmdk";

import UserItem from "@/components/interface/nav/items/search/User";
import Sound from "@/components/interface/nav/items/search/Sound";
import { UserType } from "@/types/dbTypes";
import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";

interface SearchProps {
  searchData: any;
}

const Results = ({ searchData }: SearchProps) => {
  // For tracking the active search item
  const active = useCommandState((state) => state.value);

  const appleData = searchData.appleData || {};
  const userData = Array.isArray(searchData.users) ? searchData.users : [];

  const filteredAlbums = appleData.filteredAlbums || [];
  const filteredSongs = appleData.filteredSongs || [];

  // Combining the different data types into a single array
  const allData = [
    ...filteredAlbums.map((album: AlbumData) => ({ ...album, type: "albums" })),
    ...filteredSongs.map((song: SongData) => ({ ...song, type: "songs" })),
    ...userData.map((user: UserType) => ({ ...user, type: "users" })),
  ];

  return (
    <Command.List>
      {allData.map((item, index) => {
        switch (item.type) {
          case "albums":
          case "songs":
            return (
              <div key={item.id} className={`relative z-0`}>
                <Sound sound={item} />
                {active === item.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 bg-silver m-2 shadow-shadowKitLow -z-10"
                    style={{ borderRadius: 16 }}
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
              </div>
            );
          case "users":
            return <UserItem key={index} user={item} />;
          default:
            return null;
        }
      })}
    </Command.List>
  );
};

export default Results;
