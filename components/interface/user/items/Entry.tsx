import React, { useRef, useState } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Heart from "@/components/global/Heart";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";

interface UserProps {
  artifact: ArtifactExtended;
  containerRef: React.RefObject<HTMLElement>;
  index: number;
}

export const Entry: React.FC<UserProps> = ({
  artifact,
  containerRef,
  index,
}) => {
  const user = useUser();

  const { handleSelectSound } = useSound();
  const [hoverContent, setHoverContent] = useState(false);

  const variants = {
    initial: { translateY: 50, borderRadius: 16 },
    hover: {
      translateY: 0,
      borderRadius: 24,
    },
    hoverContent: {
      translateY: 288,
      borderRadius: 8,
    },
  };

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "560")
    .replace("{h}", "560");
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

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  return (
    <motion.div
      style={{
        width: 224,
        height: 288,
      }}
      className={`flex flex-col p-4 rounded-3xl relative shadow-shadowKitHigh will-change-transform overflow-hidden bg-white outline outline-silver outline-1`}
    >
      {/* Content Container */}
      <motion.div
        onHoverStart={() => setHoverContent(true)}
        onHoverEnd={() => setHoverContent(false)}
        className={`flex flex-col gap-4`}
        onClick={handleEntryClick}
      >
        <div className={`flex items-center gap-4 justify-between w-full`}>
          <div className={`relative`}>
            <EntryDial rating={artifact.content!.rating!} />
            <div
              className={`font-serif text-base leading-[11px] font-semibold text-black center-x center-y absolute`}
            >
              {/*{artifact.content!.rating}*/}
            </div>
          </div>

          <div className={`flex flex-col items-end`}>
            <div className={`text-xs text-gray2 line-clamp-1`}>
              {sound.attributes.artistName}
            </div>
            <div className={`font-medium text-sm text-black line-clamp-1`}>
              {sound.attributes.name}
            </div>
          </div>
        </div>

        <div className={`text-sm text-black line-clamp-[12]`}>
          {artifact.content?.text}
        </div>
      </motion.div>

      {/* Artwork */}
      <motion.div
        className="cursor-pointer absolute bottom-0 left-0 shadow-cardArt overflow-hidden"
        variants={variants}
        animate={hoverContent ? "hoverContent" : "initial"}
        whileHover="hover"
        transition={{
          type: "spring",
          stiffness: 357,
          damping: 38,
          mass: 1.5,
        }}
        onClick={handleSoundClick}
      >
        <Image
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={224}
          height={224}
        />
      </motion.div>
    </motion.div>
  );
};
