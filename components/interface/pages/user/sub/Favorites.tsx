import React from "react";
import Image from "next/image";

import { getAlbumById } from "@/lib/global/musicKit";

import { useQuery } from "@tanstack/react-query";

import generateArtworkUrl from "@/components/global/GenerateArtworkUrl";

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
  reviews: number;
  sounds: number;
  bio: string;
}

const FavoriteAlbum: React.FC<AlbumProps> = ({ albumId, index }) => {
  const { data, isLoading } = useQuery(["album", albumId], () =>
    getAlbumById(albumId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const url = generateArtworkUrl(data.attributes.artwork.url, "722");

  return (
    <Image
      className={`rounded-lg shadow-index ${index === 0 ? "mr-6" : ""} `}
      src={url}
      alt={`${data.attributes.name}'s artwork`}
      width={361}
      height={361}
      draggable="false"
    />
  );
};

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  reviews,
  sounds,
  bio,
}) => {
  return (
    <div className="flex flex-col gap-6 overflow-hidden mt-[108px] w-full h-full">
      <div className="flex gap-6 flex-row-reverse overflow-y-scroll scrollbar-none">
        {favorites?.map((fav, index) => (
          <FavoriteAlbum
            key={fav.album.id}
            albumId={fav.album.id}
            index={index}
          />
        ))}
        <div className="w-6"></div>
      </div>

      <div className="w-full flex flex-col gap-2 justify-end text-xs text-gray2 pl-6">
        <div className="font-semibold text-[10px] pb-2">YEAR 1</div>
        <div className="flex gap-2">
          <div className="min-w-[43px]">CODA</div>
          <div className="font-semibold">{reviews}</div>
        </div>
        <div className="flex gap-2">
          <div className="">SOUND</div>
          <div className="font-semibold">{sounds}</div>
        </div>
        <div className="text-black">{bio}</div>
      </div>
    </div>
  );
};

export default Favorites;
