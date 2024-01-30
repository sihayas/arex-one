import React from "react";

// import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import Image from "next/image";
import { WispIcon } from "@/components/icons";
import { useSoundContext } from "@/context/SoundContext";

interface WispProps {
  artifact: ArtifactExtended;
}

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  // const { user } = useInterfaceContext();
  const { playContent } = useSoundContext();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "120")
    .replace("{h}", "120");
  const color = sound.attributes.artwork.bgColor;
  const artist = sound.attributes.artistName;
  const name = sound.attributes.name;

  // const apiUrl = artifact.heartedByUser
  //   ? "/api/heart/delete/artifact"
  //   : "/api/heart/post/artifact";

  // const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
  //   artifact.heartedByUser,
  //   artifact._count.hearts,
  //   apiUrl,
  //   "artifactId",
  //   artifact.id,
  //   artifact.author.id,
  //   user?.id,
  // );

  const handleSoundClick = async () => {
    playContent(sound.id, sound.type);
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

      {/* Cloud / Content */}
      <motion.div className="flex w-[304px] flex-col pb-2">
        <div
          className={`cloud-shadow relative flex h-[222px] w-[304px] flex-col items-center gap-[11px]`}
        >
          <WispIcon className={`absolute left-0 top-0`} />

          <div
            className={`relative z-10 flex w-[152px] items-center gap-2 pt-6`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              initial={{ borderRadius: 9999 }}
              className={`shadow-shadowKitMedium outline-silver cursor-pointer overflow-hidden outline outline-1`}
            >
              <Image
                src={artwork}
                alt={`${sound.attributes.name} artwork`}
                width={48}
                height={48}
              />
            </motion.div>

            <div className={`flex flex-col`}>
              <p className={`text-gray5 line-clamp-1 max-w-[90px] text-sm`}>
                {artist}
              </p>
              <p
                className={`text-gray4 line-clamp-1 max-w-[106px] text-base font-semibold`}
              >
                {name}
              </p>
            </div>
          </div>

          <div
            className={`z-10 flex h-[88px] w-[232px] items-center justify-center`}
          >
            <p
              className={`text-gray4 line-clamp-4 break-words text-center text-base`}
            >
              {artifact.content?.text}
            </p>
          </div>
        </div>
        <div
          onClick={handleSoundClick}
          className={`rounded-max border-silver -mb-2 ml-8 h-[36px] w-[36px] cursor-pointer border bg-white`}
        />
        <div
          className={`rounded-max border-silver h-[16px] w-[16px] border bg-white`}
        />
        {/*Ambien*/}
        <motion.div
          style={{
            background: `#${color}`,
            backgroundRepeat: "repeat, no-repeat",
            width: "calc(100% - 52px)",
          }}
          className={`absolute bottom-0 left-[52px] -z-10 h-full w-full`}
        />
      </motion.div>
    </div>
  );
};
