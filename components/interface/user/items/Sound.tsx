import React from "react";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";

interface SoundProps {
  artifact: ArtifactExtended;
  index: number;
}

export const Sound: React.FC<SoundProps> = ({ artifact, index }) => {
  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "480")
    .replace("{h}", "480");
  const name = sound.attributes.name;
  const artist = sound.attributes.artistName;

  return (
    <motion.div
      className={`flex flex-col rounded-3xl relative w-[192px] h-[256px]`}
    >
      <div
        className={`bg-white flex-col overflow-hidden w-full rounded-3xl shadow-shadowKitLow`}
      >
        <div className={`flex items-center justify-between w-full p-4 gap-4`}>
          <div className={`relative`}>
            <EntryDial rating={artifact.content!.rating!} />
            <div
              className={`font-serif text-base leading-[11px] text-black center-x center-y absolute`}
            >
              {artifact.content!.rating}
            </div>
          </div>

          <div className={`flex flex-col items-end gap-2`}>
            <div className={`text-sm text-gray2 leading-[9px] line-clamp-1`}>
              {artist}
            </div>
            <div
              className={`font-semibold text-base text-black leading-[11px] line-clamp-1`}
            >
              {name}
            </div>
          </div>
        </div>
        <Image
          className={`rounded-3xl shadow-cardArtMini`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={192}
          height={192}
        />
      </div>
    </motion.div>
  );
};
