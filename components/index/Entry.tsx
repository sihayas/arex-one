import React, { useEffect, useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { ArtifactExtended } from "@/types/globalTypes";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";
import { useInterfaceContext } from "@/context/InterfaceContext";

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

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const { user } = useInterfaceContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [rotate, setRotate] = React.useState(false);

  const sound = artifact.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 540, 540);
  const color = sound.attributes.artwork.bgColor;

  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";

  const { scrollY } = useScroll({
    container: containerRef,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log(latest);
  });

  // const scale = useSpring(useTransform(scrollY, [432, 400], [1, 1.1]), {
  //   stiffness: 300,
  //   damping: 30,
  // });

  // Flip as we scroll;

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
          height: 400,
          ...maskStyle,
          // scale,
          transformStyle: "preserve-3d",
        }}
        ref={containerRef}
        className={`flex flex-col will-change-transform bg-white relative z-10 scrollbar-none overflow-y-auto snap-y snap-mandatory overscroll-contain`}
      >
        <div className={`min-w-full min-h-full bg-red/50`}></div>
        <motion.div
          animate={controls}
          className={`flex flex-col -scroll-mt-8 snap-start`}
        >
          <Image
            className={`outline outline-1 outline-silver min-w-[304px] min-h-[304px]`}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={304}
            height={304}
          />
          {/* Content Container */}
          <div className={`px-6 pt-4 pb-2 flex items-center gap-2`}>
            <EntryDial rating={artifact.content!.rating!} />

            <div className={`flex flex-col`}>
              <div className={`text-sm text-gray2 line-clamp-1`}>
                {sound.attributes.artistName}
              </div>
              <div
                className={`font-semibold text-base text-black line-clamp-1`}
              >
                {sound.attributes.name}
              </div>
            </div>
          </div>

          <div className={`text-base text-black px-6`}>
            {artifact.content?.text}
          </div>
        </motion.div>
      </motion.div>

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
        className="absolute -top-[28px] left-[46px] mix-blend-multiply"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </div>
  );
};
