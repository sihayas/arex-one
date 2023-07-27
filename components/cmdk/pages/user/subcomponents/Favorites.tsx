import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAlbumById } from "@/lib/musicKit";
import { generateArtworkUrl } from "@/components/cmdk/generics";
import { AsteriskIcon } from "@/components/icons";

interface AlbumProps {
  albumId: string;
}

interface Favorites {
  album: {
    id: string;
  };
}

const FavoriteAlbum: React.FC<AlbumProps> = ({ albumId }) => {
  const { data, isLoading } = useQuery(["album", albumId], () =>
    getAlbumById(albumId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const url = generateArtworkUrl(data.attributes.artwork.url, "996");

  return (
    <div>
      <Image
        className="rounded-2xl shadow-albumFavorite"
        src={url}
        alt="album artwork"
        width={498}
        height={498}
        draggable="false"
      />
    </div>
  );
};

const Favorites: React.FC<{ favorites: Favorites[] }> = ({ favorites }) => {
  return (
    <div className="flex flex-col gap-8">
      {favorites?.map((fav) => (
        <>
          <div className="relative">
            <FavoriteAlbum key={fav.album.id} albumId={fav.album.id} />
            <div className="absolute top-2 left-2 bg-blurWhite backdrop-blur-sm border border-blurWhite rounded-full p-[6px]">
              <AsteriskIcon width={24} height={24} color={"white"} />
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Favorites;
