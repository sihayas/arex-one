import React, {useState} from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getAlbumsByIds } from '@/lib/global/musicKit';
import GenerateArtworkUrl from '@/components/global/GenerateArtworkUrl';
import { AlbumData } from '@/lib/global/interfaces';
import ColorThief from "colorthief";
import ParticlesComponent from "@/components/interface/pages/user/sub/ParticlesComponent";


type FavoriteAlbumProps = {
    albumData: AlbumData;
    onNewPalette: (color: any[]) => void; // new prop
}

const FavoriteAlbum = ({ albumData, onNewPalette }: FavoriteAlbumProps) => {
const colorThief = new ColorThief();

    const url = GenerateArtworkUrl(albumData.attributes.artwork.url, '800');


    const handlePaletteGenerated = (img: HTMLImageElement) => {
        // @ts-ignore
        const palette = colorThief.getPalette(img, 3);
        onNewPalette(palette);  // Should call handleNewPalette from the Favorites component
    };
    return (
        <>
            <div className="flex flex-col gap-[6px]">
                <div className="text-black leading-3 text-sm">{albumData.attributes.name}</div>
                <div className="text-gray2 leading-3 text-xs">{albumData.attributes.artistName}</div>
            </div>
            <Image
                className="absolute rounded-[8px] shadow-md opacity-0 top-1/2 right-0 transform -translate-y-1/2 right-[128px]"
                src={url || '/images/default.webp'}
                alt="artwork"
                width={320}
                height={320}
                quality={100}
                onLoadingComplete={(img) => handlePaletteGenerated(img)}
            />
        </>
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
    // 2D array of rgb strings
    const [colors, setColors] = useState<string[][]>([]);
    const albumIds = favorites.map(fav => fav.album.id);
    const { data, isLoading } = useQuery(['albums', albumIds], () => getAlbumsByIds(albumIds));

    const arrayToRGB = (arr: number[]) => `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;

    const handleNewPalette = (newPalette: number[][]) => {
        const rgbStrings = newPalette.map(arrayToRGB);
        setColors(prevColors => [...prevColors, rgbStrings]);
    };

    console.log(colors)
    return (
        <>
            <ParticlesComponent colors={colors} />
            {isLoading && <div>Loading...</div>}
            {data?.map((albumData: AlbumData, index: number) => (
                <FavoriteAlbum
                    key={albumData.id}
                    albumData={albumData}
                    onNewPalette={handleNewPalette}
                />
            ))}
        </>
    );
};


export default Favorites;

