import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <div
      className={`flex flex-col px-2 pb-12 bg-[#E4E4E4] items-center rounded-b-2xl shadow-shadowKitLow h-fit`}
    >
      {essentials.map((essential, i) => (
        <div
          className={`w-fit h-fit overflow-hidden ${
            i === 2 && "rounded-b-2xl"
          }`}
          key={essential.id}
        >
          <Artwork sound={essential.appleAlbumData} width={176} height={176} />
        </div>
      ))}
      <div className={`relative`}>
        <p
          className={`absolute leading-[9px] text-xs text-gray5 uppercase left-1/2 -translate-x-1/2 top-4`}
        >
          essentials
        </p>
      </div>
    </div>
  );
};

export default Essentials;
