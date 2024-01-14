import React from "react";

import { useArtifact, useSound } from "@/hooks/usePage";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";

interface WispProps {
  artifact: ArtifactExtended;
}

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  const { user } = useInterfaceContext();
  const { handleSelectSound } = useSound();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "320")
    .replace("{h}", "320");
  const color = sound.attributes.artwork.bgColor;
  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";
  //
  // const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
  //   artifact.heartedByUser,
  //   artifact._count.hearts,
  //   apiUrl,
  //   "artifactId",
  //   artifact.id,
  //   artifact.author.id,
  //   user?.id,
  // );

  const handleEntryClick = useArtifact(artifact);
  const handleSoundClick = () => {
    handleSelectSound(sound);
  };

  if (!sound) return null;

  return (
    <motion.div className="flex flex-col w-[224px] h-fit shadow-shadowKitHigh rounded-2xl rounded-bl-lg outline outline-silver outline-1 overflow-hidden">
      <div className={`flex items-center gap-2 bg-[#F4F4F4]/75 p-2`}>
        <Image
          className={`cursor-pointer rounded-lg shadow-shadowKitLow`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={36}
          height={36}
        />
        <div className={`flex flex-col`}>
          <p className={`text-gray2 text-xs`}>{sound.attributes.artistName}</p>
          <p className={`text-gray2 text-sm font-medium`}>
            {sound.attributes.name}
          </p>
        </div>
      </div>

      <div
        onClick={handleEntryClick}
        className={`bg-white p-3 break-words line-clamp-[8] w-full text-sm text-gray2 `}
      >
        {artifact.content?.text}
      </div>
    </motion.div>
  );
};

// <motion.div className="flex flex-col gap-4 w-[240px] h-[316px] bg-white p-6 shadow-shadowKitHigh rounded-3xl">
//     <div className={`flex search-end justify-between gap-1.5`}>
//         <div className={`flex flex-col gap-2`}>
//             <p className={`text-gray2 text-sm leading-[9px]`}>
//                 {sound.attributes.artistName}
//             </p>
//             <p className={`text-gray2 text-base font-semibold`}>
//                 {sound.attributes.name}
//             </p>
//         </div>
//         <Image
//             className={`cursor-pointer rounded-[16px] shadow-shadowKitLow`}
//             src={artwork}
//             alt={`artwork`}
//             loading="lazy"
//             quality={100}
//             width={72}
//             height={72}
//         />
//     </div>
//
//     <div
//         onClick={handleEntryClick}
//         className={`break-words line-clamp-[8] w-full text-base text-gray2 `}
//     >
//         {artifact.content?.text}
//     </div>
// </motion.div>
