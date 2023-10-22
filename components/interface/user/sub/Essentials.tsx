import React, { useState, useEffect } from "react";
import { AlbumData } from "@/types/appleTypes";
import { Artwork } from "@/components/global/Artwork";

interface EssentialsProps {
  favorites: AlbumData[];
}

const Essentials: React.FC<EssentialsProps> = ({ favorites }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % favorites.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [favorites]);

  return (
    <div className="flex flex-col gap-4 relative overflow-scroll h-full p-8 scrollbar-none w-3/5">
      {favorites.map((albumData, i) => (
        <div
          key={albumData.id}
          style={{
            position: "absolute",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1)" : "scale(0.95)",
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          <Artwork
            className="!rounded-[13px] shadow-shadowKitLow"
            sound={albumData}
            width={288}
            height={288}
          />
        </div>
      ))}
    </div>
  );
};

export default Essentials;
