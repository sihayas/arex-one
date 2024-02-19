import React, { useState } from "react";

import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import {
  FiveStar,
  FourHalfStar,
  FourStar,
  HalfStar,
  OneHalfStar,
  OneStar,
  ThreeHalfStar,
  ThreeStar,
  TwoHalfStar,
  TwoStar,
} from "@/components/icons";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { Interaction } from "@/components/global/Interaction";

interface EntryProps {
  artifact: ArtifactExtended;
}

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

const starComponents = {
  0.5: HalfStar,
  1: OneStar,
  1.5: OneHalfStar,
  2: TwoStar,
  2.5: TwoHalfStar,
  3: ThreeStar,
  3.5: ThreeHalfStar,
  4: FourStar,
  4.5: FourHalfStar,
  5: FiveStar,
};

export const getStarComponent = (
  rating: number,
  width: number = 16,
  height: number = 16,
) => {
  //@ts-ignore
  const StarComponent = starComponents[Math.ceil(rating * 2) / 2];
  return StarComponent ? <StarComponent width={width} height={height} /> : null;
};

export const Entry: React.FC<EntryProps> = ({ artifact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const appleData = artifact.sound.appleData;

  const name = appleData.attributes.name;
  const artistName = appleData.attributes.artistName;
  const color = appleData.attributes.artwork.bgColor;
  const url = MusicKit.formatArtworkURL(
    appleData.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  return (
    <motion.div className={`relative flex w-[356px] items-end gap-2.5`}>
      <Avatar
        className={`border-silver z-10 h-[42px] border`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      {/* Applying drop-shadow directly to Tilt breaks the flip effect! */}
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
              src={url}
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
                  src={url}
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

      {/* Interactions */}
      <Interaction artifact={artifact} />

      <p
        className={`text-gray2 absolute -bottom-7 left-[68px] font-medium mix-blend-darken`}
      >
        {artifact.author.username}
      </p>

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] -z-10 h-[432px] w-[304px]`}
      />
    </motion.div>
  );
};

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//   artifact.heartedByUser,
//   artifact._count.hearts,
//   apiUrl,
//   "artifactId",
//   artifact.id,
//   artifact.author.id,
//   user?.id,
// );

// <Heart
//   handleHeartClick={handleHeartClick}
//   hearted={hearted}
//   className="absolute -top-[26px] left-[46px] z-10 -m-12 p-12 mix-blend-multiply"
//   heartCount={heartCount}
//   replyCount={artifact._count.replies}
// />

// const apiUrl = artifact.heartedByUser
//   ? "/api/artifact/delete/heart"
//   : "/api/artifact/post/heart";
