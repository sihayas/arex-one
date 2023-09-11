import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getAlbumsByIds } from '@/lib/global/musicKit';
import GenerateArtworkUrl from '@/components/global/GenerateArtworkUrl';
import { AlbumData } from '@/lib/global/interfaces';


type FavoriteAlbumProps = {
    albumData: AlbumData;
    index: number;
}

const FavoriteAlbum = ({ albumData, index }: FavoriteAlbumProps) => {
  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, '160');
  const leftOffset = 32 + (index * 88);

  return (
      <div className="grid gap-x-8 items-center" style={{ gridTemplateColumns: '160px 32px' }}>
        <div className="absolute top-1/2 -translate-y-1/2 blur-2xl" style={{ left: `${leftOffset}px` }}>
          <Image
              className="rounded-[6px] border border-silver"
              src={url || '/images/default.webp'}
              alt="artwork"
              width={80}
              height={80}
              onDragStart={(e) => e.preventDefault()}
              draggable="false"
          />
        </div>
        <div className="text-sm text-black leading-3 line-clamp-1 ml-auto uppercase">{albumData.attributes.name}</div>
        <div className="w-[10px] h-[10px] bg-black rounded-[2px] ml-auto" />

      </div>
  );
};


interface FavoritesProps {
  favorites: {
    album: {
      id: string;
    };
  }[];
}


const Favorites = ({ favorites }:FavoritesProps) => {
  const albumIds = favorites.map(fav => fav.album.id);
  const { data, isLoading } = useQuery(['albums', albumIds], () => getAlbumsByIds(albumIds));

  return (
      <>
        {isLoading && <div>Loading...</div>}
        {data?.map((albumData: AlbumData, index:number) => (
            <FavoriteAlbum key={albumData.id} albumData={albumData} index={index} />
        ))}
      </>
  );
};

export default Favorites;
