import React, { useState, useEffect } from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <div className="flex gap-x-4 h-fit w-full items-center mt-auto">
      {essentials.map((essential, i) => (
        <div className={`w-fit h-fit`} key={essential.id}>
          <Artwork
            className="!rounded-[12px] shadow"
            sound={essential.appleAlbumData}
            width={96}
            height={96}
          />
        </div>
      ))}
    </div>
  );
};

export default Essentials;
