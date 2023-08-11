import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAlbumById } from "@/lib/global/musicKit";
import { generateArtworkUrl } from "@/components/cmdk/generics";

interface AlbumProps {
  albumId: string;
  isFirst: boolean; // Add this prop to know if it's the first item
}

interface Favorites {
  album: {
    id: string;
  };
}

const FavoriteAlbum: React.FC<AlbumProps> = ({ albumId, isFirst }) => {
  const { data, isLoading } = useQuery(["album", albumId], () =>
    getAlbumById(albumId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const url = generateArtworkUrl(data.attributes.artwork.url, "600");

  return (
    <Image
      className={`rounded-lg shadow-albumFavorite`} // Use Tailwind's margin-left class conditionally
      src={url}
      alt={`${data.attributes.name}'s artwork`}
      width={300}
      height={300}
      draggable="false"
    />
  );
};

const Favorites: React.FC<{ favorites: Favorites[] }> = ({ favorites }) => {
  return (
    <div className="flex flex-col items-end gap-6 overflow-scroll scrollbar-none mt-[64px] mr-6 pb-32">
      <div className="text-sm -mb-2">favorites</div>
      {favorites?.map((fav, index) => (
        <FavoriteAlbum
          key={fav.album.id}
          albumId={fav.album.id}
          isFirst={index === 0}
        /> // Pass isFirst prop here
      ))}
    </div>
  );
};

export default Favorites;
