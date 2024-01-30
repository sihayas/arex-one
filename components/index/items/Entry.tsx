import React, { useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
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

interface NewAProps {
  artifact: ArtifactExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_card_top_outlined.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_top_outlined.svg')",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleSelectSound } = useSound();
  const { handleSelectArtifact } = useArtifact();

  const sound = artifact.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 540, 540);
  const color = sound.attributes.artwork.bgColor;

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

  return (
    <div
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
      <motion.div
        style={{
          width: 304,
          height: 432,
          ...maskStyle,
        }}
        ref={containerRef}
        className={`relative z-10 flex flex-col bg-white will-change-transform`}
      >
        <Image
          onClick={() => handleSelectSound(sound)}
          className={`cursor-pointer`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={304}
          height={304}
        />

        <motion.div
          onClick={() => handleSelectArtifact(artifact)}
          className={`cursor-pointer px-6 pt-2.5 text-base text-black `}
        >
          {artifact.content?.text}
        </motion.div>

        <div
          className={`absolute bottom-0 left-0 z-50 flex items-center gap-2 px-6 py-3`}
        >
          {/* {getStarComponent(artifact.content!.rating!)} */}
          <div className={`line-clamp-1 text-base font-semibold text-black`}>
            {sound.attributes.name}
          </div>
        </div>

        <motion.div
          style={{
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 24%, #FFF 55.32%)`,
            height: "50px",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 10,
          }}
          className={`absolute left-0 w-full`}
        />
      </motion.div>

      <div
        className={`cloud-shadow absolute bottom-0 right-0 h-[432px] w-[304px]`}
      >
        <MaskCardTopOutlined />
      </div>

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

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[26px] left-[46px] z-10 mix-blend-multiply"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </div>
  );
};
