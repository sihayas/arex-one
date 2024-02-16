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
    <div className={`ml-auto flex flex-col w-full h-full items-end -space-y-4`}>
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
              className={`rounded-3xl shadow-shadowKitHigh outline outline-silver outline-1 cursor-pointer ${rotationClass} ${
                i === 1 ? "-translate-x-[88px] z-10" : ""
              }`}
              onClick={() => handleSoundClick(sound)}
              src={artwork}
              alt={`${sound.attributes.name} by ${sound.attributes.artistName} - artwork`}
              quality={100}
              width={112}
              height={112}
              draggable={false}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default Essentials;
