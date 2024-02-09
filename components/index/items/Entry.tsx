import React, { useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

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
import { Art } from "@/components/global/Art";

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
  const { handleSelectArtifact } = useArtifact();
  const containerRef = useRef<HTMLDivElement>(null);

  const sound = artifact.appleData;
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
      <div
        style={{
          width: 304,
          height: 432,
          ...maskStyle,
        }}
        ref={containerRef}
        className={`relative z-10 flex flex-col will-change-transform bg-white p-6 gap-[18px]`}
      >
        {/* Metadata */}
        <Art
          size={240}
          containerClass="shadow-shadowKitHigh rounded-[17px] overflow-hidden outline outline-1 outline-silver mx-2 mt-2"
          sound={sound}
        />

        <div className="`text-base line-clamp-5 text-black">
          {artifact.content?.text}
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-20 p-3 flex gap-2 items-end"
          style={{
            backgroundImage:
              "linear-gradient(to top, #fff 68.91%, transparent)",
          }}
        >
          <div className="rounded-max outline-silver bg-[#F4F4F4] p-[11px] outline outline-1 w-fit shadow-shadowKitMedium">
            {getStarComponent(artifact.content!.rating!)}
          </div>

          <div className={`flex flex-col translate-y-[1px]`}>
            <p className={`text-gray2 line-clamp-1 text-sm`}>
              {sound.attributes.artistName}
            </p>
            <p className={`line-clamp-1 text-base font-medium text-black`}>
              {sound.attributes.name}
            </p>
          </div>
        </div>
      </div>

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
