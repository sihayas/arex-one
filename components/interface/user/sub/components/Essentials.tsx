import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { AlbumData } from "@/types/appleTypes";
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
      width={224}
      height={224}
    />
  );
};

interface EssentialsProps {
  favorites: any;
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
  return (
    <div className="flex flex-col gap-4 relative overflow-scroll h-full p-8 scrollbar-none">
      <div className="text-xs font-medium text-gray3 leading-[75%] tracking-widest -mb-2">
        ESSENTIALS
      </div>
        {favorites.map((albumData:AlbumData) => (
          <EssentialItem key={albumData.id} albumData={albumData} />
        ))}
      </div>
  );
};

export default Essentials;
