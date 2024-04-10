import React from "react";

import { EntryExtended } from "@/types/globalTypes";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useInterfaceContext } from "@/context/Interface";
import { cardBackMask } from "@/components/index/items/Entry";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { Interaction } from "@/components/global/Interaction";
import { getStarComponent } from "@/components/global/Star";

interface UserProps {
  entry: EntryExtended;
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
  WebkitMaskImage: "url('/images/mask_card_front.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Entry: React.FC<UserProps> = ({ entry, index }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const [isFlipped, setIsFlipped] = React.useState(true);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const isEven = index % 2 === 0;
  const rotate = isEven ? -1 : 1;

  // First card translations
  const xZero = useSpring(
    useTransform(scrollY, [0, 24], [-78, 0]),
    springConfig,
  );
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [112, 0]),
    springConfig,
  );
  const rotateZero = useSpring(
    useTransform(scrollY, [0, 24], [-2, rotate]),
    springConfig,
  );

  // Second card translations
  const xOne = useSpring(
    useTransform(scrollY, [0, 24], [-80, 0]),
    springConfig,
  );
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-306, 0]),
    springConfig,
  );
  const scaleOne = useSpring(
    useTransform(scrollY, [0, 24], [0.89, 1]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [4, rotate]),
    springConfig,
  );

  const sound = entry.sound.appleData;

  if (!sound) return;

  const name = sound.attributes.name;
  const artistName = sound.attributes.artistName;
  const artwork = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  const apiUrl = entry.heartedByUser
    ? "/api/entry/post/heart"
    : "/api/entry/post/heart";

  return (
    <motion.div
      style={{
        y: index === 0 ? yZero : index === 1 ? yOne : 0,
        x: index === 0 ? xZero : index === 1 ? xOne : 0,
        scale: index === 1 ? scaleOne : 1,
        zIndex: 10 - index,
        rotate: index === 0 ? rotateZero : index === 1 ? rotateOne : 0,
      }}
      whileHover={{ zIndex: 100 }}
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
          glareEnable={true}
          glareMaxOpacity={0.45}
          glareBorderRadius={"32px"}
          scale={1.02}
          transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
          className={`transform-style-3d relative h-[432px] w-[304px] rounded-[32px]`}
        >
          {/* Front */}
          <div
            style={{ ...cardMask }}
            className="backface-hidden absolute left-0 top-0 flex h-full w-full flex-col bg-white"
          >
            <Image
              className={`-mt-6`}
              src={artwork}
              alt={`${name} by ${artistName} - artwork`}
              quality={100}
              width={304}
              height={304}
              draggable={false}
            />
            <div className="`text-base line-clamp-3 px-6 pt-[18px] text-black">
              {entry.content?.text}
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, #fff 68.91%, transparent)",
              }}
              className="absolute bottom-0 left-0 flex h-[72px] w-full items-center gap-3 p-6"
            >
              {getStarComponent(entry.content?.rating)}

              <div className={`flex translate-y-[1px] flex-col`}>
                <p className={`text-gray2 line-clamp-1 text-sm font-medium`}>
                  {artistName}
                </p>
                <p
                  className={`line-clamp-1 text-base font-semibold text-black`}
                >
                  {name}
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            style={{ ...cardBackMask, transform: "rotateX(180deg)" }}
            className="backface-hidden absolute left-0 top-0 flex h-full  w-full flex-col bg-white p-6 pb-0 "
          >
            <div className={`flex flex-shrink-0 justify-between gap-2`}>
              <div className={`flex-col flex`}>
                <div>{getStarComponent(entry.content!.rating)}</div>

                <p
                  className={`text-gray2 line-clamp-1 text-sm font-medium mt-auto`}
                >
                  {artistName}
                </p>
                <p
                  className={`line-clamp-2 text-base font-semibold text-black`}
                >
                  {name}
                </p>
              </div>

              <Image
                className={`shadow-shadowKitHigh rounded-xl`}
                src={artwork}
                alt={`${name} by ${artistName} - artwork`}
                quality={100}
                width={88}
                height={88}
                draggable={false}
              />
            </div>

            <p className={`line-clamp-[12] pt-[18px] text-base cursor-default`}>
              {entry.content?.text}
            </p>
          </div>
        </Tilt>
      </div>

      <Interaction entry={entry} isMirrored={isEven} />
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
