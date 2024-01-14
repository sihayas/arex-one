import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";

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
  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    apiUrl,
    "artifactId",
    artifact.id,
    artifact.author.id,
    user?.id,
  );

  const handleEntryClick = useArtifact(artifact);
  const handleSoundClick = () => {
    handleSelectSound(sound);
  };

  return (
    <div className={`flex items-end gap-2.5 relative w-[356px] h-fit`}>
      <Avatar
        className={`h-[42px] border border-silver`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />
      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className=".mix-blend-darker absolute -top-[28px] left-[46px] mix-blend-multiply"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
      {/* Content Inner / Card */}
      <motion.div className="flex flex-col w-[304px] shadow-shadowKitHigh rounded-3xl rounded-bl-lg outline outline-silver outline-1 overflow-hidden">
        <div className={`flex items-center gap-2 bg-[#F4F4F4]/75 p-4`}>
          <Image
            className={`cursor-pointer rounded-xl shadow-shadowKitLow`}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={48}
            height={48}
            onClick={handleSoundClick}
          />
          <div className={`flex flex-col`}>
            <p className={`text-gray2 text-sm`}>
              {sound.attributes.artistName}
            </p>
            <p className={`text-gray2 text-base font-medium`}>
              {sound.attributes.name}
            </p>
          </div>
        </div>

        <div
          onClick={handleEntryClick}
          className={`bg-white p-6 break-words line-clamp-[8] w-full text-base text-gray2 `}
        >
          {artifact.content?.text}
        </div>
        {/* Ambien */}
        <motion.div
          style={{
            background: `#FFF`,
            backgroundRepeat: "repeat, no-repeat",
            width: "calc(100% - 52px)",
          }}
          className={`absolute left-[52px] bottom-0 w-full h-full -z-10`}
        />
      </motion.div>
    </div>
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
