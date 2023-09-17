import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/lib/global/interfaces";
import ColorThief from "colorthief";
import ProfileParticles from "@/components/interface/pages/user/sub/components/ProfileParticles";

type FavoriteItemProps = {
  albumData: AlbumData;
  onNewPalette: (color: any[]) => void;
};

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  albumData,
  onNewPalette,
}) => {
  const colorThief = new ColorThief();
  const { name, artistName, artwork } = albumData.attributes;
  const url = GenerateArtworkUrl(artwork?.url, "800");

  const handlePaletteGenerated = (img: HTMLImageElement) => {
    // @ts-ignore
    const palette = colorThief.getPalette(img, 3);
    onNewPalette(palette);
  };

  return (
    <>
      <div className="flex flex-col gap-[6px]">
        <div className="text-black leading-3 text-sm">{name}</div>
        <div className="text-gray2 leading-3 text-xs">{artistName}</div>
      </div>
      <Image
        className="absolute rounded-[8px] shadow-md opacity-0 top-1/2 transform -translate-y-1/2 right-[128px]"
        src={url || "/images/default.webp"}
        alt="artwork"
        width={320}
        height={320}
        quality={100}
        onLoadingComplete={(img) => handlePaletteGenerated(img)}
      />
    </>
  );
};

interface ProfileFavoritesProps {
  favorites: {
    album: {
      id: string;
    };
  }[];
}

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ favorites }) => {
  const [colors, setColors] = useState<string[][]>([]);
  const albumIds = favorites.map((fav) => fav.album.id);
  const { data, isLoading } = useQuery(["albums", albumIds], () =>
    getAlbumsByIds(albumIds),
  );

  const arrayToRGB = (arr: number[]) => `rgb(${arr.join(", ")})`;

  const handleNewPalette = (newPalette: number[][]) => {
    const rgbStrings = newPalette.map(arrayToRGB);
    setColors((prevColors) => [...prevColors, rgbStrings]);
  };

  return (
    <>
      <ProfileParticles colors={colors} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data?.map((albumData: AlbumData) => (
          <FavoriteItem
            key={albumData.id}
            albumData={albumData}
            onNewPalette={handleNewPalette}
          />
        ))
      )}
    </>
  );
};

export default ProfileFavorites;
