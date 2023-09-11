import React from "react";
import Image from "next/image";

import { getAlbumById } from "@/lib/global/musicKit";

import { useQuery } from "@tanstack/react-query";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface AlbumProps {
  albumId: string;
  index: number;
}

interface Favorites {
  album: {
    id: string;
  };
}

interface FavoritesProps {
  favorites: Favorites[];
  bio: string;
}

const FavoriteAlbum: React.FC<AlbumProps> = ({ albumId, index }) => {
  const { data, isLoading } = useQuery(["album", albumId], () =>
    getAlbumById(albumId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const url = GenerateArtworkUrl(data.attributes.artwork.url, "722");

  return (
    <div className="flex items-center">
      <div className=" w-[10px] h-[10px] bg-black rounded-[1px]" />
      <div className="ml-[54px] text-sm text-black">{data.attributes.name}</div>
    </div>
  );
};

const Favorites: React.FC<FavoritesProps> = ({ favorites, bio }) => {
  return (
    <>
      {favorites?.map((fav, index) => (
        <FavoriteAlbum
          key={fav.album.id}
          albumId={fav.album.id}
          index={index}
        />
      ))}
    </>
  );
};

export default Favorites;
