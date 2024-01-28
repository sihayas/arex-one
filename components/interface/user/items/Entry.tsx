import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useSound } from "@/hooks/usePage";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { MaskCardTop } from "@/components/icons";

interface UserProps {
  artifact: ArtifactExtended;
  index: number;
}

const springConfig = {
  damping: 34,
  stiffness: 224,
};

export const Entry: React.FC<UserProps> = ({ artifact, index }) => {
  const { user, scrollContainerRef } = useInterfaceContext();
  const { handleSelectSound } = useSound();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useSpring(
    useTransform(scrollY, [0, 24], [0.84, 1]),
    springConfig,
  );

  // First card translations
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [-256, 0]),
    springConfig,
  );

  // Second card translations
  const xOne = useSpring(
    useTransform(scrollY, [0, 24], [-312, 0]),
    springConfig,
  );
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-256, 0]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [12, 0]),
    springConfig,
  );

  // Third card translations
  const xTwo = useSpring(useTransform(scrollY, [0, 24], [40, 0]), springConfig);
  const yTwo = useSpring(
    useTransform(scrollY, [0, 24], [-640, 0]),
    springConfig,
  );
  const rotateTwo = useSpring(
    useTransform(scrollY, [0, 24], [21, 0]),
    springConfig,
  );

  // Fourth card translations
  const xThree = useSpring(
    useTransform(scrollY, [0, 24], [-248, 0]),
    springConfig,
  );
  const yThree = useSpring(
    useTransform(scrollY, [0, 24], [-608, 0]),
    springConfig,
  );
  const rotateThree = useSpring(
    useTransform(scrollY, [0, 24], [28, 0]),
    springConfig,
  );

  const sound = artifact.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 560, 560);
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
    handleSelectSound(sound);
  };

  const maskStyle = {
    maskImage: "url('/images/mask_card_top.svg')",
    maskSize: "cover",
    maskRepeat: "no-repeat",
    WebkitMaskImage: "url('/images/mask_card_top.svg')",
    WebkitMaskSize: "cover",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <motion.div
      style={{
        y:
          index === 0
            ? yZero
            : index === 1
            ? yOne
            : index === 2
            ? yTwo
            : index === 3
            ? yThree
            : 0,
        x:
          index === 0
            ? 0
            : index === 1
            ? xOne
            : index === 2
            ? xTwo
            : index === 3
            ? xThree
            : 0,
        rotate:
          index === 0
            ? 0
            : index === 1
            ? rotateOne
            : index === 2
            ? rotateTwo
            : index === 3
            ? rotateThree
            : 0,
        scale: index < 4 ? scale : 1,
        zIndex: index === 0 ? 10 : index === 1 ? 9 : index === 2 ? 8 : 7,
        transformOrigin: index === 0 ? "top left" : "center center",
      }}
      className={`relative`}
    >
      <motion.div
        style={{
          width: 304,
          height: 400,
          ...maskStyle,
        }}
        className={`flex flex-col will-change-transform bg-white relative z-10`}
      >
        {/* Content Container */}
        <div
          className={`flex items-center gap-3 justify-between w-full px-6 py-7`}
        >
          <EntryDial rating={artifact.content!.rating!} />

          <div className={`flex flex-col items-end`}>
            <div className={`text-sm text-gray2 line-clamp-1`}>
              {sound.attributes.artistName}
            </div>
            <div className={`font-medium text-base text-black line-clamp-1`}>
              {sound.attributes.name}
            </div>
          </div>
        </div>

        {/* Artwork */}
        <motion.div onClick={handleSoundClick}>
          <Image
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={304}
            height={304}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// <div className={`text-sm text-black line-clamp-[12]`}>
//   {artifact.content?.text}
// </div>
