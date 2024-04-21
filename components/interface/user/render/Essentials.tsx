import Image from "next/image";
import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import { useSound } from "@/hooks/usePage";
import { AlbumData } from "@/types/appleTypes";
import { motion } from "framer-motion";
import { LaurelIcon } from "@/components/icons";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();

  const handleSoundClick = (sound: AlbumData) => {
    handleSelectSound(sound);
  };

  return (
    <>
      {essentials.map((essential, i) => {
        const { appleData: sound } = essential;
        const artwork = MusicKit.formatArtworkURL(
          sound.attributes.artwork,
          128 * 2.5,
          128 * 2.5,
        );

        const rotationClass =
          i % 3 === 0 ? "rotate-3" : i % 3 === 2 ? "-rotate-3" : "";
        const transformClass = i === 1 ? "-translate-x-[88px]" : "";

        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={`essential-${essential.id}`}
            className={`min-w-[128px] min-h-[128px] overflow-hidden rounded-[20px] outline outline-1 outline-silver shadow-shadowKitHigh ${rotationClass} ${transformClass}`}
          >
            <Image
              onClick={() => handleSoundClick(sound)}
              src={artwork}
              alt={`${sound.attributes.name} by ${sound.attributes.artistName} - artwork`}
              width={128}
              height={128}
              draggable={false}
            />
          </motion.div>
        );
      })}

      {essentials.length === 0 && (
        <>
          <LaurelIcon className={`mt-[60px] -rotate-[24deg] -translate-x-4`} />
          <div className="w-28 h-28 bg-white rounded-[20px] shadow-shadowKitHigh -rotate-12 mt-4" />
          <div className="w-28 h-28 bg-white rounded-[20px] shadow-shadowKitHigh z-10" />
          <div className="w-28 h-28 bg-white rounded-[20px] shadow-shadowKitHigh rotate-12 mt-4" />
          <LaurelIcon
            className={`-scale-x-[1] mt-[60px] rotate-[24deg] translate-x-4`}
          />
        </>
      )}
    </>
  );
};

export default Essentials;
