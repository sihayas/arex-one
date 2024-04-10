import React from "react";

// import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";

import { EntryExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import { useEntry, useSound } from "@/hooks/usePage";
import Image from "next/image";

interface WispProps {
  entry: EntryExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_wisp.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_wisp.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Wisp: React.FC<WispProps> = ({ entry }) => {
  const { handleSelectEntry } = useEntry();
  const { handleSelectSound } = useSound();

  const sound = entry.sound.appleData;

  const artwork = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  const color = sound.attributes.artwork.bgColor;

  const handleSoundClick = () => {
    handleSelectSound(sound);
  };

  return (
    <div className={`-ml-14 relative flex w-[352px] items-end gap-2`}>
      <Avatar
        className={`border-silver z-10 h-[42px] border`}
        imageSrc={entry.author.image}
        altText={`${entry.author.username}'s avatar`}
        width={42}
        height={42}
        user={entry.author}
      />

      <motion.div
        onClick={() => handleSelectEntry(entry)}
        className={`relative z-10 flex flex-col -space-y-4  mb-2`}
      >
        <Image
          className={`-rotate-2 ml-3 -z-10 outline-4 outline-white outline rounded-[20px] shadow-shadowKitLow`}
          onClick={handleSoundClick}
          src={artwork}
          alt={`${sound.attributes.name} by ${sound.attributes.artistName} - artwork`}
          quality={100}
          width={88}
          height={88}
          draggable={false}
        />

        <div
          className={`bg-white px-3 py-1.5 rounded-2xl relative shadow-shadowKitHigh`}
        >
          <p className={`text-base text-black`}>{entry.content?.text}</p>
          <div className={`absolute z-0 h-3 w-3 -bottom-1 -left-1`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
            />
            <div
              className={`absolute bottom-0 left-0 h-1 w-1 rounded-full bg-white`}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
          width: 92,
          height: 92,
        }}
        className={`absolute left-[60px] -top-1 -z-10 -rotate-2`}
      />
    </div>
  );
};
