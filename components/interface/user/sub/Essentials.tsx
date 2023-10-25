import React, { useState, useEffect } from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <div className="flex gap-x-8 gap-y-8 h-fit w-full flex-wrap items-center justify-center">
      {essentials.map((essential, i) => (
        <div className={`w-fit h-fit`} key={essential.id}>
          <Artwork
            className="!rounded-[8px] shadow-shadowKitLow"
            sound={essential.appleAlbumData}
            width={128}
            height={128}
          />
        </div>
      ))}
    </div>
  );
};

export default Essentials;
