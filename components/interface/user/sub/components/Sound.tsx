import React, { useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { BlurDiv } from "@/components/global/Blur";

interface SoundProps {
  artifact: ArtifactExtended;
  containerRef: React.RefObject<HTMLElement>;
  index: number;
}

export const Sound: React.FC<SoundProps> = ({
  artifact,
  containerRef,
  index,
}) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["center end", "center start"],
  });

  const scrollRange = [0, 0.5, 1];

  const scaleValues = [0.875, 1, 0.875];
  const rotateValues = isEven ? [2, 0, -2] : [2, 0, 2];
  const zIndexValues = [0, 1, 0];

  const scale = useTransform(scrollYProgress, scrollRange, scaleValues);
  const rotate = useTransform(scrollYProgress, scrollRange, rotateValues);
  const zIndex = useTransform(scrollYProgress, scrollRange, zIndexValues);

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "720")
    .replace("{h}", "720");
  const name = sound.attributes.name;
  const artist = sound.attributes.artistName;

  if (!sound) return null;

  return (
    <section
      style={{ marginTop: index > 0 ? "-32px" : "16px" }}
      className={`w-full min-h-fit flex snap-center`}
    >
      <motion.div
        ref={ref}
        style={{
          marginRight: isEven ? "auto" : "",
          marginLeft: isEven ? "" : "auto",
          rotate: rotate,
          scale: scale,
          zIndex: zIndex,
        }}
        className={`flex flex-col rounded-3xl relative w-[240px] min-h-[240px] will-change-transform overflow-hidden shadow-miniCard`}
      >
        <div className={`flex flex-col gap-3 mt-auto mx-6 mb-6`}>
          <div
            className={`text-white text-base font-medium z-0 leading-[11px] line-clamp-1`}
          >
            {name}
          </div>
          <div className={`text-gray3 text-sm z-0 leading-[9px]`}>{artist}</div>
        </div>
        <Image
          className={`cursor-pointer -z-20`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />

        <div
          className={`pointer-events-none absolute bottom-0 left-0 w-full h-1/2 -z-10`}
        >
          <div className={`w-full h-full relative`}>
            <BlurDiv
              zIndex={1}
              blurValue={1}
              gradientStops="rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(255, 255, 255, 0) 37.5%"
            />
            <BlurDiv
              zIndex={2}
              blurValue={2}
              gradientStops="rgba(255, 255, 255, 0) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(255, 255, 255, 0) 50%"
            />
            <BlurDiv
              zIndex={3}
              blurValue={3}
              gradientStops="rgba(255, 255, 255, 0) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(255, 255, 255, 0) 62.5%"
            />
            <BlurDiv
              zIndex={4}
              blurValue={4}
              gradientStops="rgba(255, 255, 255, 0) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(255, 255, 255, 0) 75%"
            />
            <BlurDiv
              zIndex={5}
              blurValue={5}
              gradientStops="rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 87.5%"
            />
            <BlurDiv
              zIndex={6}
              blurValue={5.25}
              gradientStops="rgba(255, 255, 255, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(255, 255, 255, 0) 100%"
            />
            <BlurDiv
              zIndex={7}
              blurValue={5.5}
              gradientStops="rgba(255, 255, 255, 0) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 1) 100%"
            />
            <BlurDiv
              zIndex={8}
              blurValue={5.75}
              gradientStops="rgba(255, 255, 255, 0) 87.5%, rgba(0, 0, 0, 1) 100%"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
