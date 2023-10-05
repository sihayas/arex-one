import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/lib/global/interfaces";
import ColorThief from "colorthief";
import { AlbumDBData } from "@/lib/global/interfaces";
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
    <Image
      className="rounded-[8px] shadow-md"
      src={url || "/images/default.webp"}
      alt="artwork"
      width={90}
      height={90}
      quality={100}
      onLoadingComplete={(img) => handlePaletteGenerated(img)}
    />
  );
};

interface EssentialsProps {
  favorites: AlbumData[];
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
  const [colors, setColors] = useState<string[][]>([]);
  // @ts-ignore
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
    <div className="flex flex-col gap-[14px]">
      <div className="text-xs text-gray2 font-mono leading-none text-center">
        ESSENTIALS
      </div>
      <div className="flex gap-[9px]">
        {/*<Particle colors={colors} />*/}
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
