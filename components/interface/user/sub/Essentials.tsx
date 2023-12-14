import React from "react";
import { Essential } from "@/types/dbTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import ArtworkURL from "@/components/global/ArtworkURL";
import { useSound } from "@/hooks/usePage";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();
  return (
    <div className={`w-max flex flex-col items-center p-8 pb-[88px] gap-4`}>
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const color = sound.attributes.artwork.bgColor;
        const url = ArtworkURL(sound.attributes.artwork.url, "400");
        return (
          <>
            <Image
              onClick={() => handleSelectSound(sound, url)}
              className={`rounded-2xl shadow-shadowKitMedium`}
              src={url}
              alt={`artwork`}
              loading="lazy"
              quality={100}
              width={152}
              height={152}
            />
            <div
              style={{
                backgroundColor: `#${color}`,
                width: `152px`,
                height: `152px`,
                top: `${32 + i * (152 + 16)}px`,
              }}
              className="absolute left-8 -z-20 rounded-max"
            />
          </>
        );
      })}
      <div
        className={`absolute center-y left-[176px] text-xs text-gray2 leading-[9px] font-medium z-10 -rotate-90 tracking-tight`}
      >
        essentials
      </div>
    </div>
  );
};

export default Essentials;
