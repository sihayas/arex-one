import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAlbumById } from "@/lib/global/musicKit";
import { generateArtworkUrl } from "@/components/cmdk/generics";

interface AlbumProps {
  albumId: string;
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
}

const FavoriteAlbum: React.FC<AlbumProps> = ({ albumId }) => {
  const { data, isLoading } = useQuery(["album", albumId], () =>
    getAlbumById(albumId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const url = generateArtworkUrl(data.attributes.artwork.url, "460");

  return (
    <Image
      className={`rounded-lg shadow-index`} // Use Tailwind's margin-left class conditionally
      src={url}
      alt={`${data.attributes.name}'s artwork`}
      width={230}
      height={230}
      draggable="false"
    />
  );
};

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  reviews,
  sounds,
}) => {
  return (
    <div className="flex flex-wrap flex-row-reverse items-end gap-6 overflow-scroll scrollbar-none mt-[108px] pb-32 pr-6 w-[532px] h-full">
      {favorites?.map((fav) => (
        <FavoriteAlbum key={fav.album.id} albumId={fav.album.id} />
      ))}
      <div className="w-[230px] h-[230px] flex flex-col gap-2 justify-end text-xs text-gray2">
        <div className="flex gap-2">
          <div className="min-w-[43px]">CODA</div>
          <div className="font-semibold">{reviews}</div>
        </div>
        <div className="flex gap-2">
          <div className="">SOUND</div>
          <div className="font-semibold">{sounds}</div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
