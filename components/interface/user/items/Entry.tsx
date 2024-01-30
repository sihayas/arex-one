import React from "react";

import { useSound } from "@/hooks/usePage";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { MaskCardBottomOutlined } from "@/components/icons";
import { getStarComponent } from "@/components/index/items/Entry";

interface UserProps {
  artifact: ArtifactExtended;
  index: number;
}

const springConfig = {
  damping: 34,
  stiffness: 224,
};

const maskStyle = {
  maskImage: "url('/images/mask_card_bottom_outlined.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_bottom_outlined.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Entry: React.FC<UserProps> = ({ artifact, index }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const { handleSelectSound } = useSound();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const isEven = index % 2 === 0;
  const rotate = isEven ? -2 : 2;

  const scale = useSpring(
    useTransform(scrollY, [0, 24], [0.84, 1]),
    springConfig,
  );

  // First card translations
  const xZero = useSpring(useTransform(scrollY, [0, 24], [0, 0]), springConfig);
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [-36, 0]),
    springConfig,
  );
  const rotateZero = useSpring(
    useTransform(scrollY, [0, 24], [0, rotate]),
    springConfig,
  );

  // Second card translations
  const xOne = useSpring(
    useTransform(scrollY, [0, 24], [-80, 0]),
    springConfig,
  );
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-420, 0]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [12, rotate]),
    springConfig,
  );

  // Third card translations
  const xTwo = useSpring(useTransform(scrollY, [0, 24], [64, 0]), springConfig);
  const yTwo = useSpring(
    useTransform(scrollY, [0, 24], [-760, 0]),
    springConfig,
  );
  const rotateTwo = useSpring(
    useTransform(scrollY, [0, 24], [21, rotate]),
    springConfig,
  );

  const sound = artifact.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 560, 560);
  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  return (
    <motion.div
      style={{
        y: index === 0 ? yZero : index === 1 ? yOne : index === 2 ? yTwo : 0,
        x: index === 0 ? xZero : index === 1 ? xOne : index === 2 ? xTwo : 0,
        scale: index < 4 ? scale : 1,
        zIndex: 10 - index,
        rotate: index === 0 ? rotateZero : index === 1 ? rotateOne : rotateTwo,
      }}
      className={`relative ${isEven ? "mr-auto" : "ml-auto"}`}
    >
      <motion.div
        style={{
          width: 304,
          height: 432,
          ...maskStyle,
        }}
        className={`relative z-10 flex flex-col bg-white will-change-transform`}
      >
        {/* Metadata */}
        <div className={`flex w-full items-start justify-between p-6 pb-3`}>
          <div className="rounded-max outline-silver mr-auto bg-[#F4F4F4] p-3 outline outline-1">
            {getStarComponent(artifact.content!.rating!)}
          </div>
          <div className={`flex w-full flex-col items-end`}>
            <Image
              className="border-silver shadow-shadowKitHigh rounded-[17px] border"
              onClick={handleSoundClick}
              src={artwork}
              alt={`artwork`}
              quality={100}
              width={184}
              height={184}
            />

            <div className={`text-gray2 line-clamp-1 pt-3 text-end text-sm`}>
              {sound.attributes.artistName}
            </div>
            <div
              className={`line-clamp-1 text-end text-base font-medium text-black`}
            >
              {sound.attributes.name}
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="`text-base line-clamp-6 px-6 text-black">
          {artifact.content?.text}
        </div>
      </motion.div>

      <div
        className={`cloud-shadow absolute bottom-0 right-0 h-[432px] w-[304px]`}
      >
        <MaskCardBottomOutlined />
      </div>
    </motion.div>
  );
};
// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//     artifact.heartedByUser,
//     artifact._count.hearts,
//     apiUrl,
//     "artifactId",
//     artifact.id,
//     artifact.author.id,
//     user?.id,
// );
