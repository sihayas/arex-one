import React, { useState } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

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
  MaskCardTopOutlined,
  OneHalfStar,
  OneStar,
  ThreeHalfStar,
  ThreeStar,
  TwoHalfStar,
  TwoStar,
} from "@/components/icons";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

interface NewAProps {
  artifact: ArtifactExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_card_top.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_top.svg')",
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

export const getStarComponent = (rating: number) => {
  //@ts-ignore
  const StarComponent = starComponents[Math.ceil(rating * 2) / 2];
  return StarComponent ? <StarComponent /> : null;
};

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const { user } = useInterfaceContext();
  const { handleSelectSound } = useSound();
  const { handleSelectArtifact } = useArtifact();
  const [isFlipped, setIsFlipped] = useState(false);

  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";

  const sound = artifact.appleData;
  const name = sound.attributes.name;
  const artistName = sound.attributes.artistName;
  const color = sound.attributes.artwork.bgColor;
  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

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

  return (
    <motion.div
      className={`over group group relative flex w-[356px] items-end gap-2.5`}
    >
      <Avatar
        className={`border-silver z-10 h-[42px] border`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      {/* Content Inner / Card */}
      <Tilt
        flipVertically={isFlipped}
        perspective={1000}
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        tiltReverse={false}
        glareEnable={true}
        glareMaxOpacity={0.45}
        scale={1.02}
        transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
        className={`cloud-shadow rounded-[32px] overflow-hidden`}
      >
        <motion.div
          style={{
            ...maskStyle,
          }}
          // onClick={() => handleSelectArtifact(artifact)}
          onClick={() => {
            setIsFlipped(!isFlipped);
          }}
          className="relative flex cursor-pointer flex-col bg-white will-change-transform w-[304px] h-[432px]"
        >
          <Image
            className={`-mt-6`}
            onClick={handleSoundClick}
            src={url}
            alt={`${name} by ${artistName} - artwork`}
            quality={100}
            width={304}
            height={304}
            draggable={false}
          />

          <div className="`text-base line-clamp-3 px-6 pt-[15px] text-black">
            {artifact.content?.text}
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundImage:
                "linear-gradient(to top, #fff 68.91%, transparent)",
            }}
            className="absolute bottom-0 left-0 flex h-[72px] w-full items-end p-3 pr-6"
          >
            <div className="rounded-max outline-silver w-fit bg-white p-2.5">
              {getStarComponent(artifact.content!.rating!)}
            </div>

            <div className={`flex translate-y-[1px] flex-col`}>
              <p className={`line-clamp-1 text-sm text-black`}>
                {sound.attributes.artistName}
              </p>
              <p className={`line-clamp-1 text-base font-semibold text-black`}>
                {sound.attributes.name}
              </p>
            </div>
          </div>
        </motion.div>
      </Tilt>

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] -z-10 h-[400px] w-[304px]`}
      />

      {/*<Heart*/}
      {/*  handleHeartClick={handleHeartClick}*/}
      {/*  hearted={hearted}*/}
      {/*  className="absolute -top-[26px] left-[46px] z-10 mix-blend-multiply"*/}
      {/*  heartCount={heartCount}*/}
      {/*  replyCount={artifact._count.replies}*/}
      {/*/>*/}
    </motion.div>
  );
};
