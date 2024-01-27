import React, { useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

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

  const handleEntryClick = useArtifact(artifact);

  return (
    <div
      className={`flex items-end gap-2.5 relative group w-[356px] group over`}
    >
      <Avatar
        className={`h-[42px] border border-silver z-10`}
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
        className={`flex flex-col will-change-transform bg-white relative z-10`}
      >
        <Image
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={304}
          height={304}
        />

        <motion.div
          onClick={handleEntryClick}
          className={`text-base text-black px-6 pt-2.5 cursor-pointer `}
        >
          {artifact.content?.text}
        </motion.div>

        <div
          className={`absolute bottom-0 left-0 py-3 px-6 flex items-center gap-2 z-50`}
        >
          {getStarComponent(artifact.content!.rating!)}
          <div className={`font-semibold text-base text-black line-clamp-1`}>
            {sound.attributes.name}
          </div>
          <div className={`-mx-1 text-gray3`}>&middot;</div>
          <div className={` text-base text-gray2 line-clamp-1`}>
            {sound.attributes.artistName}
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
        className={`absolute bottom-0 right-0 w-[304px] h-[432px] cloud-shadow`}
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
        className={`absolute left-[52px] w-[304px] h-[400px] -z-10`}
      />

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[26px] left-[46px] mix-blend-multiply z-10"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </div>
  );
};
