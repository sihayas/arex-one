import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/lib/global/interfaces";
import { JellyComponent } from "@/components/global/Loading";

type EssentialItemProps = {
  albumData: AlbumData;
};

const EssentialItem: React.FC<EssentialItemProps> = ({ albumData }) => {
  const { name, artistName, artwork } = albumData.attributes;
  const url = GenerateArtworkUrl(artwork?.url, "800");

  return (
    <Image
      className="rounded-[8px] shadow-md"
      src={url}
      alt="artwork"
      width={90}
      height={90}
    />
  );
};

interface EssentialsProps {
  favorites: AlbumData[];
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
  return (
    <div className="flex flex-col gap-[14px] relative">
      <div className="text-xs text-gray2 font-mono leading-none text-center">
        ESSENTIALS
      </div>
      <div className="flex gap-[9px]">
        {favorites.map((albumData) => (
          <EssentialItem key={albumData.id} albumData={albumData} />
        ))}
      </div>
    </div>
  );
};

export default Essentials;
