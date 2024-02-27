import React from "react";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { getStarComponent } from "@/components/index/items/Entry";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { Interaction } from "@/components/global/Interaction";

interface UserProps {
  artifact: ArtifactExtended;
  index: number;
}

const springConfig = {
  damping: 34,
  stiffness: 224,
};

const cardMask = {
  maskImage: "url('/images/mask_card_top.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_top.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

const backArtMask = {
  maskImage: "url('/images/mask_art_card_back.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_art_card_back.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Entry: React.FC<UserProps> = ({ artifact, index }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const [hovered, setHovered] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const isEven = index % 2 === 0;
  const rotate = isEven ? -2 : 2;

  // First card translations
  const xZero = useSpring(
    useTransform(scrollY, [0, 24], [-48, 0]),
    springConfig,
  );
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [-64, 0]),
    springConfig,
  );
  const scaleZero = useSpring(
    useTransform(scrollY, [0, 24], [0.74, 1]),
    springConfig,
  );
  const rotateZero = useSpring(
    useTransform(scrollY, [0, 24], [0, rotate]),
    springConfig,
  );

  // Second card translations
  const xOne = useSpring(
    useTransform(scrollY, [0, 24], [-190, 0]),
    springConfig,
  );
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-472, 0]),
    springConfig,
  );
  const scaleOne = useSpring(
    useTransform(scrollY, [0, 24], [0.63, 1]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [6, rotate]),
    springConfig,
  );

  // Third card translations
  const xTwo = useSpring(useTransform(scrollY, [0, 24], [76, 0]), springConfig);
  const yTwo = useSpring(
    useTransform(scrollY, [0, 24], [-880, 0]),
    springConfig,
  );
  const scaleTwo = useSpring(
    useTransform(scrollY, [0, 24], [0.52, 1]),
    springConfig,
  );
  const rotateTwo = useSpring(
    useTransform(scrollY, [0, 24], [12, rotate]),
    springConfig,
  );

  const sound = artifact.sound.appleData;

  if (!sound) return;

  const name = sound.attributes.name;
  const artistName = sound.attributes.artistName;
  const artwork = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  const apiUrl = artifact.heartedByUser
    ? "/api/artifact/post/heart"
    : "/api/artifact/post/heart";

  return (
    <motion.div
      style={{
        y: index === 0 ? yZero : index === 1 ? yOne : index === 2 ? yTwo : 0,
        x: index === 0 ? xZero : index === 1 ? xOne : index === 2 ? xTwo : 0,
        scale:
          index === 0
            ? scaleZero
            : index === 1
            ? scaleOne
            : index === 2
            ? scaleTwo
            : 1,
        zIndex: 10 - index,
        rotate: index === 0 ? rotateZero : index === 1 ? rotateOne : rotateTwo,
      }}
      className={`relative ${isEven ? "mr-auto" : "ml-auto"}`}
    >
      <div
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
        className={`cloud-shadow z-20`}
      >
        {/* Scene */}
        <Tilt
          flipVertically={isFlipped}
          perspective={1000}
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          tiltReverse={true}
          reset={false}
          glareEnable={true}
          glareMaxOpacity={0.45}
          glareBorderRadius={"32px"}
          scale={1.02}
          transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
          className={`transform-style-3d relative h-[432px] w-[304px] rounded-[32px]`}
        >
          {/* Front */}
          <div
            style={{
              ...cardMask,
            }}
            className="backface-hidden absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col bg-white"
          >
            <Image
              className={`-mt-6`}
              // onClick={handleSoundClick}
              src={artwork}
              alt={`${name} by ${artistName} - artwork`}
              quality={100}
              width={304}
              height={304}
              draggable={false}
            />
            <div className="`text-base line-clamp-3 px-6 pt-[18px] text-black">
              {artifact.content?.text}
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, #fff 68.91%, transparent)",
              }}
              className="absolute bottom-0 left-0 flex h-[72px] w-full items-center gap-3 p-6"
            >
              {getStarComponent(artifact.content!.rating!, 20, 20)}

              <div className={`flex translate-y-[1px] flex-col`}>
                <p className={`line-clamp-1 text-sm text-black`}>
                  {sound.attributes.artistName}
                </p>
                <p
                  className={`line-clamp-1 text-base font-semibold text-black`}
                >
                  {sound.attributes.name}
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            style={{
              ...cardMask,
              transform: "rotateX(180deg)",
            }}
            className="backface-hidden absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col bg-white p-6 pb-0"
          >
            {/* Header */}
            <div className={`flex w-full gap-2`}>
              <div
                style={{
                  ...backArtMask,
                }}
                className={`relative h-[72px] w-[72px] flex-shrink-0`}
              >
                <Image
                  src={artwork}
                  alt={`${name} by ${artistName} - artwork`}
                  quality={100}
                  width={72}
                  height={72}
                  draggable={false}
                />
                <div className="rounded-max outline-silver absolute bottom-0 right-0 w-fit bg-white p-2.5">
                  {getStarComponent(artifact.content!.rating!)}
                </div>
              </div>

              <div className={`flex flex-col pt-2`}>
                <p className={`text-gray2 text-sm font-medium`}>11.02.63</p>
                <p className={`mt-auto line-clamp-1 text-sm text-black`}>
                  {artistName}
                </p>
                <p
                  className={`line-clamp-1 text-base font-semibold text-black`}
                >
                  {name}
                </p>
              </div>
            </div>

            <p className={`line-clamp-[14] pt-2.5 text-base`}>
              {artifact.content?.text}
            </p>
          </div>
        </Tilt>
      </div>

      <Interaction artifact={artifact} />
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
