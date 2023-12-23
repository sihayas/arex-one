import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import Image from "next/image";
import { useSound } from "@/hooks/usePage";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();
  return (
    <div className={`w-max flex items-center`}>
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const color = sound.attributes.artwork.bgColor;
        const artwork = sound.attributes.artwork.url
          .replace("{w}", "400")
          .replace("{h}", "400");
        return (
          <Fragment key={`essential-${i}`}>
            <Image
              onClick={() => handleSelectSound(sound)}
              className={`shadow-shadowKitMedium`}
              src={artwork}
              alt={`artwork`}
              loading="lazy"
              quality={100}
              width={192}
              height={192}
            />
            <div
              style={{
                backgroundColor: `#${color}`,
                width: `192px`,
                height: `192px`,
                left: `${i * 192}px`,
              }}
              className="absolute top-8 -z-20 rounded-max"
            />
          </Fragment>
        );
      })}
      <div
        className={`absolute top-[200px] center-x text-xs text-gray2 leading-[9px] font-medium z-10 tracking-tight`}
      >
        essentials
      </div>
    </div>
  );
};

export default Essentials;
