import React from "react";

// import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import { useArtifact, useSound } from "@/hooks/usePage";
import Image from "next/image";

interface WispProps {
  artifact: ArtifactExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_card.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

const wispStyle = {
  maskImage: "url('/images/mask_wisp.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_wisp.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  const { handleSelectArtifact } = useArtifact();
  const { handleSelectSound } = useSound();

  const sound = artifact.appleData;

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
    <div className={`relative flex h-fit w-[356px] items-end gap-2.5`}>
      <Avatar
        className={`border-silver z-10 h-[42px] border`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      <motion.div
        style={{
          width: 304,
          height: 432,
          ...maskStyle,
        }}
        onClick={() => handleSelectArtifact(artifact)}
        className={`relative z-10 flex cursor-pointer flex-col justify-between bg-white p-6 will-change-transform`}
      >
        {/* Metadata */}
        <div className={`flex w-full flex-col items-end`}>
          <motion.div
            style={{
              width: 128,
              height: 128,
              ...wispStyle,
            }}
          >
            <Image
              onClick={handleSoundClick}
              src={artwork}
              alt={`${sound.attributes.name} by ${sound.attributes.artistName} - artwork`}
              quality={100}
              width={128}
              height={128}
              draggable={false}
            />
          </motion.div>

          <div className={`line-clamp-1 pt-4 text-end text-sm text-black`}>
            {sound.attributes.artistName}
          </div>
          <div
            className={`line-clamp-1 text-end text-base text-black font-semibold`}
          >
            {sound.attributes.name}
          </div>
        </div>

        <motion.div
          className={`relative w-fit overflow-visible rounded-[18px] bg-[#F4F4F4] px-3 py-1.5`}
        >
          {/* Content  */}
          <div className="text-gray2 line-clamp-[7] text-base">
            {artifact.content?.text}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 -z-10 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-[#F4F4F4]`}
            />
            <div
              className={`absolute bottom-0 left-0 h-1 w-1 rounded-full bg-[#F4F4F4]`}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] -z-10 h-[400px] w-[304px]`}
      />
    </div>
  );
};
