import React from "react";
import { AlbumData } from "@/types/appleTypes";
import { Artwork } from "@/components/feed/subcomponents/Artwork";

interface EssentialsProps {
  favorites: AlbumData[];
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
  return (
    <div className="flex flex-col gap-4 relative overflow-scroll h-full p-8 scrollbar-none">
      <div className="text-xs font-medium text-gray3 leading-[75%] tracking-widest">
        ESSENTIALS
      </div>
      {favorites.map((albumData) => (
        <Artwork
          key={albumData.id}
          sound={albumData}
          width={224}
          height={224}
        />
      ))}
    </div>
  );
};

export default Essentials;
