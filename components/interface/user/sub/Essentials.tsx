import React, { useState, useEffect } from "react";
import { AlbumData } from "@/types/appleTypes";
import { Artwork } from "@/components/global/Artwork";

interface EssentialsProps {
  essentials: {
    album: AlbumData;
    albumId: string;
    appleAlbumData: any;
    createdAt: string;
    id: string;
    updatedAt: string;
    userId: string;
  }[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % essentials.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [essentials]);

  return (
    <div className="flex flex-col gap-4 relative overflow-scroll h-full scrollbar-none w-full mt-auto">
      {essentials.map((essential, i) => (
        <div
          key={essential.id}
          style={{
            position: "absolute",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1)" : "scale(0.95)",
            transition: "opacity 0.5s, transform 0.5s",
            bottom: "32px",
          }}
        >
          <Artwork
            className="!rounded-[13px] shadow-shadowKitLow"
            sound={essential.appleAlbumData}
            width={288}
            height={288}
          />
        </div>
      ))}
      <div className="text-xs text-gray3 font-medium mt-auto ml-auto mr-auto uppercase leading-[75%] tracking-widest">
        essentials
      </div>
    </div>
  );
};

export default Essentials;
