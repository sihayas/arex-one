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
          className={`w-[304px] h-[222px] relative flex flex-col gap-[11px] items-center cloud-shadow`}
        >
          <WispIcon className={`absolute top-0 left-0`} />

          <div
            className={`w-[152px] flex items-center gap-2 z-10 pt-6 relative`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              initial={{ borderRadius: 9999 }}
              className={`shadow-shadowKitMedium outline outline-silver outline-1 overflow-hidden cursor-pointer`}
            >
              <Image
                src={artwork}
                alt={`${sound.attributes.name} artwork`}
                width={48}
                height={48}
              />
            </motion.div>

            <div className={`flex flex-col`}>
              <p className={`text-sm text-gray5 max-w-[90px] line-clamp-1`}>
                {artist}
              </p>
              <p
                className={`text-base text-gray4 max-w-[106px] line-clamp-1 font-semibold`}
              >
                {name}
              </p>
            </div>
          </div>

          <div
            className={`w-[232px] h-[88px] flex items-center justify-center z-10`}
          >
            <p
              className={`break-words line-clamp-4 text-base text-gray4 text-center`}
            >
              {artifact.content?.text}
            </p>
          </div>
        </div>
        <div
          onClick={handleSoundClick}
          className={`w-[36px] h-[36px] bg-white rounded-max ml-8 -mb-2 cursor-pointer border border-silver`}
        />
        <div
          className={`w-[16px] h-[16px] bg-white rounded-max border border-silver`}
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
