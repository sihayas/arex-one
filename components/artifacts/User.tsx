import React, { useRef } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface NewAProps {
  artifact: ArtifactExtended;
  containerRef: React.RefObject<HTMLElement>;
  index: number;
}

export const User: React.FC<NewAProps> = ({
  artifact,
  containerRef,
  index,
}) => {
  const user = useUser();
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["center end", "center start"],
  });

  const scrollRange = [0, 0.5, 1];

  const scaleValues = [0.875, 1, 0.875];
  const rotateValues = isEven ? [-2, 0, -2] : [2, 0, 2];
  const zIndexValues = [0, 1, 0];

  const scale = useTransform(scrollYProgress, scrollRange, scaleValues);
  const rotate = useTransform(scrollYProgress, scrollRange, rotateValues);
  const zIndex = useTransform(scrollYProgress, scrollRange, zIndexValues);

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "720")
    .replace("{h}", "720");
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

  if (!sound) return null;

  return (
    <section
      style={{ marginTop: index > 0 ? "-32px" : "0" }}
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
        className={`flex flex-col rounded-3xl relative w-[223px] min-h-[288px] will-change-transform overflow-hidden shadow-miniCard`}
      >
        {/* Stars */}
        <Heart
          handleHeartClick={handleHeartClick}
          hearted={hearted}
          className="absolute -top-7 -left-[7px]"
          heartCount={heartCount}
          replyCount={artifact._count.replies}
        />
        <div
          className={`absolute top-6 center-x flex items-center p-2 pr-2.5 bg-white rounded-xl w-max max-w-[175px] z-10 gap-2 shadow-shadowKitMedium max-h-8`}
        >
          <Stars rating={artifact.content?.rating} />
          <div className={`text-sm text-[#000] font-bold line-clamp-1`}>
            {sound.attributes.name}
          </div>
        </div>

        <Image
          className={`cursor-pointer`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />
        {/* Gradient */}
        <div
          style={{
            background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
          }}
          className="absolute bottom-0 w-full h-4/5 pointer-events-none"
        />
        <div
          className={`absolute px-6 text-sm text-white font-semibold line-clamp-6 bottom-[18px] pointer-events-none will-change-transform`}
        >
          {artifact.content?.text}
        </div>
      </motion.div>
    </section>
  );
};
