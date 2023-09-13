import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getAlbumsByIds } from '@/lib/global/musicKit';
import GenerateArtworkUrl from '@/components/global/GenerateArtworkUrl';
import { AlbumData } from '@/lib/global/interfaces';

type FavoriteAlbumProps = {
    albumData: AlbumData;
}

const FavoriteAlbum = ({ albumData }: FavoriteAlbumProps) => {
    const url = GenerateArtworkUrl(albumData.attributes.artwork.url, '305');

    return (
        <Image
            className="rounded-[6px] shadow-sm border-[.5px] border-silver "
            src={url || '/images/default.webp'}
            alt="artwork"
            width={122}
            height={122}
            quality={100}
        />
    )  ;
};

interface FavoritesProps {
    favorites: {
        album: {
            id: string;
        };
    }[];
}

const Favorites = ({ favorites }: FavoritesProps) => {
    const albumIds = favorites.map(fav => fav.album.id);
    const { data, isLoading } = useQuery(['albums', albumIds], () => getAlbumsByIds(albumIds));


    return (
        <>
            {isLoading && <div>Loading...</div>}
            {data?.map((albumData: AlbumData, index: number) => (
                <FavoriteAlbum key={albumData.id} albumData={albumData} />
            ))}
        </>
    );
};

export default Favorites;
