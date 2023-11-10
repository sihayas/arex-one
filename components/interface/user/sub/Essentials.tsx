import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <>
      {essentials.map((essential, i) => (
        <div className={`w-fit h-fit`} key={essential.id}>
          <Artwork
            className={`${i === 0 ? "rounded-l-2xl" : ""} ${
              i === 2 ? "rounded-r-2xl" : ""
            }`}
            sound={essential.appleAlbumData}
            width={128}
            height={128}
          />
        </div>
      ))}
    </>
  );
};

export default Essentials;
