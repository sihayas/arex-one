import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { WispIcon } from "@/components/icons";
import { useSoundContext } from "@/context/SoundContext";

interface WispProps {
  artifact: ArtifactExtended;
}

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  const { user } = useInterfaceContext();
  // const { handleSelectSound } = useSound();
  const { playContent } = useSoundContext();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "120")
    .replace("{h}", "120");
  const color = sound.attributes.artwork.bgColor;
  const artist = sound.attributes.artistName;
  const name = sound.attributes.name;

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

  const handleSoundClick = async () => {
    playContent(sound.id, sound.type);
  };

  return (
    <div className={`flex items-end gap-2.5 relative w-[356px] h-fit`}>
      <Avatar
        className={`h-[42px] border border-silver z-10`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      {/* Cloud / Content */}
      <motion.div className="flex flex-col w-[304px] pb-2">
        <div
          className={`w-[304px] h-[222px] relative flex flex-col gap-4 items-center drop-shadow-xl`}
        >
          <WispIcon className={`absolute top-0 left-0`} />

          <div
            className={`w-[152px] flex items-center gap-2 z-10 pt-[30px] relative`}
          >
            <Image
              src={artwork}
              alt={`${sound.attributes.name} artwork`}
              width={40}
              height={40}
              className={`rounded-lg shadow-shadowKitMedium outline outline-silver outline-1`}
            />

            <div className={`flex flex-col`}>
              <p className={`text-xs text-gray2 max-w-[88px] line-clamp-1`}>
                {artist}
              </p>
              <p
                className={`text-sm text-gray4 max-w-[104px] line-clamp-1 font-medium`}
              >
                {name}
              </p>
            </div>
          </div>

          <div
            className={`w-[232px] h-[88px] flex items-center justify-center z-10`}
          >
            <p
              className={`break-words line-clamp-4 text-base text-gray4 text-center font-medium`}
            >
              {artifact.content?.text}
            </p>
          </div>
        </div>
        <div
          onClick={handleSoundClick}
          className={`w-[36px] h-[36px] bg-white rounded-max ml-8 -mb-2 cursor-pointer shadow-shadowKitMedium`}
        />
        <div
          className={`w-[16px] h-[16px] bg-white rounded-max shadow-shadowKitLow`}
        />
        {/*Ambien*/}
        <motion.div
          style={{
            background: `#${color}`,
            backgroundRepeat: "repeat, no-repeat",
            width: "calc(100% - 52px)",
          }}
          className={`absolute left-[52px] bottom-0 w-full h-full -z-10`}
        />
      </motion.div>
    </div>
  );
};
