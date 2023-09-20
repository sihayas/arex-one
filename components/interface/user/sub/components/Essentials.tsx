import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/lib/global/interfaces";
import ColorThief from "colorthief";
import Particle from "@/components/interface/user/sub/components/Particle";

type EssentialItemProps = {
  albumData: AlbumData;
  onNewPalette: (color: any[]) => void;
};

const EssentialItem: React.FC<EssentialItemProps> = ({
  albumData,
  onNewPalette,
}) => {
  const colorThief = new ColorThief();
  const { name, artistName, artwork } = albumData.attributes;
  const url = GenerateArtworkUrl(artwork?.url, "800");
  const [svgColor, setSvgColor] = React.useState("rgb(0,0,0)");

  const handlePaletteGenerated = (img: HTMLImageElement) => {
    // @ts-ignore
    const palette = colorThief.getPalette(img, 3);
    onNewPalette(palette);
    const [r, g, b] = palette[0];
    setSvgColor(`rgb(${r},${g},${b})`);
  };

  return (
    <>
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-2">
          <svg width="10" height="10">
            <rect
              width="10"
              height="10"
              rx="2"
              ry="2"
              style={{ fill: svgColor }}
            />
          </svg>

          <div className="text-black leading-none text-sm">{name}</div>
        </div>
        <div className="pl-[18px] text-gray2 leading-none text-xs">
          {artistName}
        </div>
      </div>
      <Image
        className="absolute rounded-[8px] shadow-md opacity-0 top-1/2 transform -translate-y-1/2 right-[128px]"
        src={url || "/images/default.webp"}
        alt="artwork"
        width={1}
        height={1}
        quality={100}
        onLoadingComplete={(img) => handlePaletteGenerated(img)}
      />
    </>
  );
};

interface EssentialsProps {
  favorites: {
    album: {
      id: string;
    };
  }[];
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
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
    <div className="flex flex-col mx-8">
      <h1 className="text-gray2 text-xs leading-none font-medium mt-[31px]">
        ESSENTIALS
      </h1>
      <div className="flex flex-col mt-[19px] gap-7">
        <Particle colors={colors} />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.map((albumData: AlbumData) => (
            <EssentialItem
              key={albumData.id}
              albumData={albumData}
              onNewPalette={handleNewPalette}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Essentials;
