import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import Image from "next/image";
import { useSound } from "@/hooks/usePage";
import { AlbumData } from "@/types/appleTypes";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();

  const handleSoundClick = (sound: AlbumData) => {
    handleSelectSound(sound);
  };

  return (
    <div className={`ml-auto flex h-full w-full flex-col items-end -space-y-8`}>
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const artwork = MusicKit.formatArtworkURL(
          sound.attributes.artwork,
          128 * 2.5,
          128 * 2.5,
        );

        const rotationClass =
          i === 0 ? "rotate-3" : i === 2 ? "rotate-3" : "-rotate-3";

        return (
          <Fragment key={`essential-${i}`}>
            <Image
              className={`shadow-shadowKitHigh outline-silver cursor-pointer rounded-[20px] outline outline-1 ${rotationClass} ${
                i === 1 ? "z-10 -translate-x-[88px]" : ""
              }`}
              onClick={() => handleSoundClick(sound)}
              src={artwork}
              alt={`${sound.attributes.name} by ${sound.attributes.artistName} - artwork`}
              quality={100}
              width={128}
              height={128}
              draggable={false}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default Essentials;
